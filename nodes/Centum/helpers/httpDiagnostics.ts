import { randomUUID } from 'crypto';
import type { IExecuteFunctions } from 'n8n-workflow';

type Phase = 'request' | 'body' | 'http' | 'parse';
type DiagnosticError = {
	name?: string;
	message?: string;
	code?: string;
	errno?: string | number;
	syscall?: string;
	cause?: DiagnosticError;
	errors?: DiagnosticError[];
	truncated?: boolean;
};

interface DiagnosticOptions {
	context?: IExecuteFunctions;
	itemIndex?: number;
	debug: boolean;
	privateKey?: string;
}

function makeSanitizer(url: string, request: RequestInit, privateKey?: string) {
	const secrets: string[] = privateKey ? [privateKey] : [];
	let values: string[];
	try {
		const parsed = new URL(url);
		secrets.push(
			parsed.username,
			parsed.password,
			decodeURIComponent(parsed.username),
			decodeURIComponent(parsed.password),
		);
		parsed.searchParams.forEach((value, key) => {
			// These two generated pagination counters are not credentials or business data.
			if (!['numeroPagina', 'cantidadItemsPorPagina'].includes(key)) secrets.push(value);
		});
		new Headers(request.headers).forEach((value, key) => {
			if (/token|key|authorization|cookie/i.test(key)) secrets.push(value);
		});
		values = [
			...new Set(secrets.filter(Boolean).flatMap((value) => [value, encodeURIComponent(value)])),
		].sort((a, b) => b.length - a.length);
	} catch {
		// If sanitization cannot be configured, never fall back to raw error text.
		return (_value: string): string => '[redacted]';
	}
	return (value: string): string => {
		// Quotes/apostrophes may be part of a URL path. Over-redact the whole token.
		let text = value.replace(/https?:\/\/\S+/gi, '[redacted URL]');
		for (const secret of values) text = text.split(secret).join('[redacted]');
		return text
			.replace(/\b(?:Bearer|Basic)\s+\S+/gi, '[redacted authorization]')
			.replace(
				/\b[\w-]*(?:token|password|secret|authorization|cookie|api[_-]?key)[\w-]*["']?\s*[:=]\s*(?:"[^"]*"|'[^']*'|[^\s,;}]+)/gi,
				'[redacted credential]',
			)
			.replace(/[\r\n\t]/g, ' ')
			.slice(0, 240);
	};
}

function serializeError(
	error: unknown,
	sanitize: (value: string) => string,
	includeMessages: boolean,
): DiagnosticError {
	const seen = new WeakSet<object>();
	let remaining = 12;
	function visit(value: unknown, depth: number): DiagnosticError {
		if (depth > 4 || remaining-- <= 0) return { truncated: true };
		if (!value || typeof value !== 'object') return { name: 'NonError', message: '[omitted]' };
		if (seen.has(value)) return { truncated: true };
		seen.add(value);
		const source = value as Record<string, unknown>;
		const result: DiagnosticError = {};
		for (const key of ['name', 'code', 'syscall'] as const) {
			if (typeof source[key] === 'string') result[key] = sanitize(source[key]);
		}
		if (typeof source.errno === 'number') result.errno = source.errno;
		else if (typeof source.errno === 'string') result.errno = sanitize(source.errno);
		if (typeof source.message === 'string') {
			result.message = includeMessages
				? sanitize(source.message)
				: '[response-derived message omitted]';
		}
		if (source.cause !== undefined) result.cause = visit(source.cause, depth + 1);
		if (Array.isArray(source.errors)) {
			result.errors = source.errors.slice(0, 4).map((child) => visit(child, depth + 1));
			if (source.errors.length > 4) result.truncated = true;
		}
		return result;
	}
	return visit(error, 0);
}

function responseHeaders(
	response: Response,
	sanitize: (value: string) => string,
): Record<string, string> {
	const headers: Record<string, string> = {};
	// Only technical headers; no Set-Cookie, Location, auth or arbitrary X-* values.
	const contentType = response.headers.get('content-type')?.split(';')[0].trim();
	if (contentType && /^[\w.+-]+\/[\w.+-]+$/.test(contentType))
		headers['content-type'] = sanitize(contentType);
	const retryAfter = response.headers.get('retry-after');
	if (
		retryAfter &&
		(/^\d{1,10}$/.test(retryAfter) ||
			/^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(retryAfter))
	) {
		headers['retry-after'] = sanitize(retryAfter);
	}
	const requestId = response.headers.get('x-request-id');
	if (requestId && /^[\w.:-]{1,128}$/.test(requestId))
		headers['x-request-id'] = sanitize(requestId);
	return headers;
}

/** Observe one fetch and its consumption; never change requests, outputs or thrown errors. */
export async function withHttpDiagnostics<T>(
	url: string,
	request: RequestInit,
	options: DiagnosticOptions,
	consume: (response: Response, setPhase: (phase: Phase) => void) => Promise<T>,
): Promise<T> {
	const started = Date.now();
	let requestId: string | null = null;
	let sanitize = (_value: string): string => '[redacted]';
	let initializationFailed = false;
	try {
		requestId = randomUUID();
		sanitize = makeSanitizer(url, request, options.privateKey);
	} catch {
		initializationFailed = true;
	}
	let response: Response | undefined;
	let phase: Phase = 'request';
	function emit(event: 'request' | 'response' | 'failure', error?: unknown): void {
		if (!options.debug && event === 'request') return;
		let isError = event === 'failure';
		// This baseline needs neither error getters nor context/URL/header metadata.
		const entry: Record<string, unknown> = {
			event,
			request_id: requestId,
			phase,
			response_received: response !== undefined,
			http_status: null,
			response_headers: {},
			...(initializationFailed ? { diagnostic_incomplete: true } : {}),
		};
		try {
			entry.http_status = response?.status ?? null;
			isError = isError || (event === 'response' && response?.ok === false);
			if (!options.debug && !isError) return;
			entry.duration_ms = Date.now() - started;
			const context = options.context;
			Object.assign(entry, {
				execution_id: context?.getExecutionId?.() ?? null,
				node: context ? sanitize(context.getNode().name) : null,
				item_index: options.itemIndex ?? 0,
				method: request.method ?? 'GET',
				origin: new URL(url).origin,
				response_headers: response ? responseHeaders(response, sanitize) : {},
				...(event === 'failure'
					? { error: serializeError(error, sanitize, phase === 'request') }
					: {}),
			});
		} catch {
			entry.diagnostic_incomplete = true;
			isError = true;
			if (event === 'failure') {
				entry.error = { name: 'UnserializableError', message: 'Technical details unavailable' };
			}
		}
		try {
			// Put JSON in the message: n8n log transports may discard metadata arguments.
			options.context?.logger?.[isError ? 'error' : 'info']?.(
				`[Centum HTTP] ${JSON.stringify(entry)}`,
			);
		} catch {
			// An unavailable logger cannot be recovered here; never replace the request error.
		}
	}
	emit('request');
	try {
		response = await fetch(url, request);
		phase = 'body';
		emit('response');
		return await consume(response, (nextPhase) => {
			phase = nextPhase;
		});
	} catch (error) {
		emit('failure', error);
		throw error;
	}
}
