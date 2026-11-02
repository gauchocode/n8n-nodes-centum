const assert = require('node:assert/strict');
const { test } = require('node:test');
const helpers = require('../dist/nodes/Centum/helpers/functions.js');
const { CentumErp } = require('../dist/nodes/Centum/CentumErp.node.js');

const url = 'https://centum.example/BL2/Choferes';
const headers = { CentumSuiteConsumidorApiPublicaId: '8', publicAccessKey: 'private-key-123' };

function makeContext(debug = true) {
	const logs = [];
	return {
		logs,
		logger: {
			info: (...args) => logs.push({ level: 'info', args }),
			error: (...args) => logs.push({ level: 'error', args }),
		},
		getExecutionId: () => '174543',
		getNode: () => ({
			name: 'Get Choferes',
			type: 'centumErp',
			typeVersion: 1,
			parameters: {},
			position: [0, 0],
		}),
		getNodeParameter: (name, _index, fallback) =>
			({
				debugSettings: { enableDebugLogging: debug, includeRequestBody: true },
				resource: 'choferes',
				operation: 'GetAll',
				simplifiedOutput: false,
			})[name] ?? fallback,
		getCredentials: async () => ({
			centumUrl: 'https://centum.example/BL2',
			consumerApiPublicId: '8',
			publicAccessKey: headers.publicAccessKey,
		}),
		getInputData: () => [{ json: {} }],
		continueOnFail: () => true,
		helpers: {
			returnJsonArray: (data) => (Array.isArray(data) ? data : [data]).map((json) => ({ json })),
		},
	};
}

function records(context) {
	return context.logs
		.filter(({ args }) => args[0].startsWith('[Centum HTTP] '))
		.map(({ args }) => {
			assert.equal(args.length, 1, 'diagnostics must survive loggers that drop metadata');
			return JSON.parse(args[0].slice('[Centum HTTP] '.length));
		});
}

function debugRecords(context) {
	return context.logs
		.filter(({ args }) => args[0].startsWith('[Centum debug] '))
		.map(({ level, args }) => {
			assert.equal(level, 'info');
			assert.equal(args.length, 1);
			const [, event, payload] = args[0].match(
				/^\[Centum debug\] (Request|Response|Error request body) (.*)$/,
			);
			return { event, ...JSON.parse(payload) };
		});
}

function mockFetch(t, fn) {
	t.mock.method(globalThis, 'fetch', fn);
}

for (const name of ['apiRequest', 'apiGetRequest', 'apiPostRequest', 'apiPostRequestPaginated']) {
	const options = {
		headers,
		...(name.includes('Post') ? { body: { private: 'business-data' } } : {}),
	};
	test(`${name}: captures DNS causes without response or retry`, async (t) => {
		const context = makeContext(false);
		const cause = Object.assign(new Error('getaddrinfo EAI_AGAIN centum.example'), {
			code: 'EAI_AGAIN',
			syscall: 'getaddrinfo',
		});
		const error = new TypeError('fetch failed', { cause });
		let calls = 0;
		mockFetch(t, async () => {
			calls++;
			throw error;
		});
		await assert.rejects(
			helpers[name](url, { ...options, context, debugItemIndex: 2 }),
			/fetch failed/,
		);
		assert.equal(calls, 1);
		const [failure] = records(context);
		assert.equal(records(context).length, 1);
		assert.equal(failure.event, 'failure');
		assert.equal(failure.phase, 'request');
		assert.equal(failure.response_received, false);
		assert.equal(failure.http_status, null);
		assert.deepEqual(failure.response_headers, {});
		assert.equal(failure.error.message, 'fetch failed');
		assert.equal(failure.error.cause.code, 'EAI_AGAIN');
		assert.equal(failure.error.cause.syscall, 'getaddrinfo');
		assert.equal(failure.execution_id, '174543');
		assert.equal(failure.node, 'Get Choferes');
		assert.equal(failure.item_index, 2);
		assert.equal(typeof failure.request_id, 'string');
		assert.ok(failure.duration_ms >= 0);
	});
	for (const status of [200, 400, 500]) {
		test(`${name}: logs HTTP ${status} before reading the body; preserves behavior`, async (t) => {
			const context = makeContext();
			let calls = 0;
			const payload =
				status === 200 ? [{ IdChofer: 7 }] : { Message: 'Private API business error' };
			mockFetch(t, async () => {
				calls++;
				const response = new Response(JSON.stringify(payload), {
					status,
					headers: {
						'content-type': 'application/json',
						'retry-after': '30',
						'x-request-id': 'req-123',
						'set-cookie': 'session=hidden-cookie',
						authorization: 'Bearer hidden-token',
						'x-secret': 'hidden-secret',
					},
				});
				const read = response.text.bind(response);
				response.text = async () => {
					const received = records(context).find((r) => r.event === 'response');
					assert.equal(
						received.http_status,
						status,
						'headers must be logged before consuming the body',
					);
					return read();
				};
				return response;
			});
			const promise = helpers[name](url, { ...options, context });
			if (status === 200) {
				const result = await promise;
				assert.deepEqual(result, name === 'apiPostRequest' ? [payload] : payload);
			} else {
				await assert.rejects(promise);
			}
			assert.equal(calls, 1);
			const rows = records(context);
			assert.equal(new Set(rows.map((r) => r.request_id)).size, 1);
			const received = rows.find((r) => r.event === 'response');
			assert.equal(received.response_received, true);
			assert.deepEqual(received.response_headers, {
				'content-type': 'application/json',
				'retry-after': '30',
				'x-request-id': 'req-123',
			});
			const serialized = JSON.stringify(rows);
			for (const secret of [
				'business-data',
				'Private API business error',
				'hidden-cookie',
				'hidden-token',
				'hidden-secret',
				headers.publicAccessKey,
				'IdChofer',
			]) {
				assert.ok(!serialized.includes(secret), `log leaked ${secret}`);
			}
			if (status !== 200) {
				assert.equal(rows.at(-1).phase, 'http');
				assert.equal(rows.at(-1).http_status, status);
			}
		});
	}
	test(`${name}: body read failure keeps received status and socket cause`, async (t) => {
		const context = makeContext();
		mockFetch(t, async () => ({
			status: 200,
			ok: true,
			headers: new Headers(),
			text: async () => {
				throw new TypeError('private body fragment', {
					cause: Object.assign(new Error('socket closed'), { code: 'UND_ERR_SOCKET' }),
				});
			},
		}));
		await assert.rejects(helpers[name](url, { ...options, context }));
		const failure = records(context).at(-1);
		assert.equal(failure.phase, 'body');
		assert.equal(failure.http_status, 200);
		assert.equal(failure.error.cause.code, 'UND_ERR_SOCKET');
		assert.ok(!JSON.stringify(records(context)).includes('private body fragment'));
	});
}

test('captures AggregateError children and bounds cyclic causes', async (t) => {
	const context = makeContext();
	const child = Object.assign(new Error('connect timeout'), { code: 'ETIMEDOUT' });
	const aggregate = new AggregateError(
		[child, Object.assign(new Error('connect refused'), { code: 'ECONNREFUSED' })],
		'connection failed',
	);
	const error = new TypeError('fetch failed', { cause: aggregate });
	child.cause = error;
	mockFetch(t, async () => {
		throw error;
	});
	await assert.rejects(helpers.apiRequest(url, { headers, context }));
	const failure = records(context).at(-1);
	assert.equal(failure.error.cause.errors[0].code, 'ETIMEDOUT');
	assert.equal(failure.error.cause.errors[1].code, 'ECONNREFUSED');
	assert.ok(JSON.stringify(failure).length < 6000);
});

test('redacts credentials, URLs, query parameters and arbitrary error fields', async (t) => {
	const context = makeContext();
	const privateUrl =
		'https://user:secret-password@centum.example/private-customer?access_token=query-secret';
	mockFetch(t, async (_url, init) => {
		const token = init.headers.CentumSuiteAccessToken;
		const error = Object.assign(
			new Error(
				`fetch failed ${privateUrl} ${headers.publicAccessKey} ${token} Bearer token-abc password=other-secret`,
			),
			{
				request: { headers: init.headers },
				response: { body: 'private-response' },
				stack: 'private-stack',
			},
		);
		throw error;
	});
	await assert.rejects(
		helpers.apiRequest(privateUrl, {
			headers,
			context,
			method: 'POST',
			body: { secret: 'private-body' },
		}),
	);
	const serialized = JSON.stringify(records(context));
	for (const secret of [
		'secret-password',
		'private-customer',
		'query-secret',
		headers.publicAccessKey,
		'token-abc',
		'other-secret',
		'private-response',
		'private-stack',
		'private-body',
		'CentumSuiteAccessToken',
	]) {
		assert.ok(!serialized.includes(secret), `log leaked ${secret}`);
	}
	assert.equal(records(context)[0].origin, 'https://centum.example');
});

test('successful requests are quiet with debug off or excluded by filter', async (t) => {
	mockFetch(t, async () => new Response('{"ok":true}'));
	const context = makeContext(false);
	assert.deepEqual(await helpers.apiRequest(url, { headers, context }), { ok: true });
	assert.equal(context.logs.length, 0);
	context.getNodeParameter = () => ({ enableDebugLogging: true, debugEndpointContains: '/Other' });
	await helpers.apiRequest(url, { headers, context });
	assert.equal(context.logs.length, 0);
});

test('new diagnostic logger failures never change successful or failed requests', async (t) => {
	const context = makeContext();
	for (const level of ['info', 'error']) {
		const legacyLogger = context.logger[level];
		context.logger[level] = (...args) => {
			if (args[0].startsWith('[Centum HTTP] ')) throw new Error('logger unavailable');
			legacyLogger(...args);
		};
	}
	mockFetch(t, async () => new Response('{"ok":true}'));
	assert.deepEqual(await helpers.apiRequest(url, { headers, context }), { ok: true });
	globalThis.fetch = async () => {
		throw new TypeError('fetch failed');
	};
	await assert.rejects(helpers.apiRequest(url, { headers, context }), /fetch failed/);
});

test('malformed JSON does not leak response fragments', async (t) => {
	const context = makeContext();
	mockFetch(t, async () => new Response('private-broken-json'));
	await assert.rejects(helpers.apiRequest(url, { headers, context }));
	const failure = records(context).at(-1);
	assert.equal(failure.phase, 'parse');
	assert.equal(failure.http_status, 200);
	assert.ok(!JSON.stringify(records(context)).includes('private-broken-json'));
});

test('binary body failures retain HTTP metadata; binary success is unchanged', async (t) => {
	const context = makeContext();
	const buffer = new Uint8Array([1, 2, 3]).buffer;
	mockFetch(t, async () => new Response(buffer));
	assert.deepEqual(
		await helpers.apiRequest(url, { headers, context, responseType: 'arraybuffer' }),
		buffer,
	);
	globalThis.fetch = async () => ({
		status: 200,
		ok: true,
		headers: new Headers(),
		arrayBuffer: async () => {
			throw new Error('read failed');
		},
	});
	await assert.rejects(helpers.apiRequest(url, { headers, context, responseType: 'arraybuffer' }));
	assert.equal(records(context).at(-1).phase, 'body');
});

test('concurrent requests have separate correlation IDs and unchanged requests', async (t) => {
	const context = makeContext();
	const requests = [];
	mockFetch(t, async (target, init) => {
		requests.push({ target, init });
		return new Response('{"ok":true}');
	});
	await Promise.all(
		[1, 2].map((id) =>
			helpers.apiRequest(url, {
				headers,
				context,
				method: 'POST',
				queryParams: { id },
				body: { id },
			}),
		),
	);
	assert.equal(requests.length, 2);
	assert.equal(requests[0].target, `${url}?id=1`);
	assert.equal(requests[0].init.method, 'POST');
	assert.equal(requests[0].init.body, '{"id":1}');
	assert.equal(
		new Set(
			records(context)
				.filter((r) => r.event === 'request')
				.map((r) => r.request_id),
		).size,
		2,
	);
});

test('continueOnFail output remains exactly the existing error string and paired item', async (t) => {
	const context = makeContext();
	mockFetch(t, async () => {
		throw new TypeError('fetch failed', {
			cause: Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' }),
		});
	});
	const result = await new CentumErp().execute.call(context);
	assert.deepEqual(result, [[{ json: { error: 'fetch failed' }, pairedItem: { item: 0 } }]]);
	assert.equal(records(context).at(-1).error.cause.code, 'ETIMEDOUT');
});

for (const code of ['UND_ERR_CONNECT_TIMEOUT', 'CERT_HAS_EXPIRED', 'ECONNRESET']) {
	test(`preserves transport code ${code} without inventing an HTTP response`, async (t) => {
		const context = makeContext(false);
		mockFetch(t, async () => {
			throw new TypeError('fetch failed', {
				cause: Object.assign(new Error('transport failed'), { code }),
			});
		});
		await assert.rejects(helpers.apiRequest(url, { headers, context }));
		const entry = records(context)[0];
		assert.equal(entry.error.cause.code, code);
		assert.equal(entry.response_received, false);
		assert.equal(entry.http_status, null);
	});
}

test('HTTP failures are visible with debug off and preserve original API message', async (t) => {
	const context = makeContext(false);
	mockFetch(
		t,
		async () =>
			new Response('{"Message":"Original business error"}', {
				status: 500,
				headers: { 'content-type': 'application/json' },
			}),
	);
	await assert.rejects(helpers.apiRequest(url, { headers, context }), (error) => {
		assert.equal(error.name, 'NodeApiError');
		assert.equal(error.message, 'Original business error');
		return true;
	});
	const rows = records(context);
	assert.deepEqual(
		rows.map((r) => r.event),
		['response', 'failure'],
	);
	assert.ok(rows.every((r) => r.http_status === 500));
	assert.ok(!JSON.stringify(rows).includes('Original business error'));
});

test('paginated requests keep page count, queries and collected items', async (t) => {
	const context = makeContext();
	const requestedUrls = [];
	mockFetch(t, async (target) => {
		requestedUrls.push(target);
		return new Response(
			JSON.stringify(
				requestedUrls.length === 1 ? { Items: [{ id: 1 }, { id: 2 }] } : { Items: [{ id: 3 }] },
			),
		);
	});
	const result = await helpers.apiPostRequestPaginated(url, {
		headers,
		context,
		body: {},
		pagination: 'custom',
		itemsPerPage: 2,
		pageInterval: 0,
	});
	assert.deepEqual(result, [{ id: 1 }, { id: 2 }, { id: 3 }]);
	assert.equal(requestedUrls.length, 2);
	assert.match(requestedUrls[0], /numeroPagina=1&cantidadItemsPorPagina=2/);
	assert.match(requestedUrls[1], /numeroPagina=2&cantidadItemsPorPagina=2/);
	assert.equal(new Set(records(context).map((r) => r.request_id)).size, 2);
	const legacy = debugRecords(context);
	assert.deepEqual(
		legacy.map((row) => row.event),
		['Request', 'Response', 'Request', 'Response'],
	);
	assert.deepEqual(
		legacy.filter((row) => row.event === 'Request').map((row) => row.url),
		requestedUrls,
	);
	assert.deepEqual(
		legacy.filter((row) => row.event === 'Response').map((row) => JSON.parse(row.body)),
		[{ Items: [{ id: 1 }, { id: 2 }] }, { Items: [{ id: 3 }] }],
	);
});

test('GET local pagination and empty responses remain unchanged without a logger', async (t) => {
	mockFetch(t, async () => new Response('{"Items":[1,2,3,4]}'));
	assert.deepEqual(
		await helpers.apiGetRequest(url, {
			headers,
			pagination: 'custom',
			itemsPerPage: 2,
			pageNumber: 2,
		}),
		[3, 4],
	);
	globalThis.fetch = async () => new Response(null, { status: 204 });
	assert.deepEqual(await helpers.apiRequest(url, { headers }), {});
});

test('error serialization is bounded for wide and deep aggregate trees', async (t) => {
	const context = makeContext(false);
	const build = (depth) =>
		depth
			? new AggregateError(
					Array.from({ length: 8 }, () => build(depth - 1)),
					'x'.repeat(5000),
				)
			: new Error('x'.repeat(5000));
	mockFetch(t, async () => {
		throw build(4);
	});
	await assert.rejects(helpers.apiRequest(url, { headers, context }));
	assert.ok(JSON.stringify(records(context)[0]).length < 10000);
	assert.match(JSON.stringify(records(context)[0]), /"truncated":true/);
});

test('malformed URL diagnostics never replace the original fetch exception', async (t) => {
	const context = makeContext();
	const original = new TypeError('Invalid URL');
	mockFetch(t, async () => {
		throw original;
	});
	await assert.rejects(
		helpers.apiGetRequest('invalid-url', { headers, context }),
		(error) => error === original,
	);
	const failure = records(context).find((record) => record.event === 'failure');
	assert.ok(failure, 'malformed diagnostic metadata must not suppress the failure record');
	assert.equal(failure.diagnostic_incomplete, true);
	assert.equal(failure.response_received, false);
	assert.equal(failure.http_status, null);
});

test('hostile error getters cannot replace the original exception', async (t) => {
	const context = makeContext(false);
	const original = new Error('fetch failed');
	Object.defineProperty(original, 'cause', {
		get() {
			throw new Error('getter failed');
		},
	});
	mockFetch(t, async () => {
		throw original;
	});
	await assert.rejects(
		helpers.apiGetRequest(url, { headers, context }),
		(error) => error === original,
	);
	const [failure] = records(context);
	assert.equal(failure.event, 'failure');
	assert.equal(failure.diagnostic_incomplete, true);
	assert.equal(failure.phase, 'request');
	assert.ok(!JSON.stringify(records(context)).includes('getter failed'));
});

for (const sensitiveUrl of [
	"https://centum.example/customer/O'NEILL/private-order",
	'https://centum.example/customer/O%27NEILL/private-order',
	'https://centum.example/customer/"private-order',
]) {
	test(`redacts the complete URL token including embedded quotes: ${sensitiveUrl}`, async (t) => {
		const context = makeContext(false);
		mockFetch(t, async () => {
			throw new TypeError(`Failed to fetch '${sensitiveUrl}'`);
		});
		await assert.rejects(helpers.apiGetRequest(url, { headers, context }));
		const [failure] = records(context);
		assert.equal(failure.event, 'failure');
		assert.ok(!JSON.stringify(records(context)).includes('NEILL'));
		assert.ok(!JSON.stringify(records(context)).includes('private-order'));
	});
}

test('unpaired surrogate in a private key cannot prevent fetch or alter its result/error', async (t) => {
	const context = makeContext();
	const malformedHeaders = { ...headers, publicAccessKey: 'key-\ud800-secret' };
	let calls = 0;
	mockFetch(t, async () => {
		calls++;
		return new Response('{"ok":true}');
	});
	assert.deepEqual(await helpers.apiGetRequest(url, { headers: malformedHeaders, context }), [
		{ ok: true },
	]);
	const original = new TypeError('fetch failed');
	globalThis.fetch = async () => {
		calls++;
		throw original;
	};
	await assert.rejects(
		helpers.apiGetRequest(url, { headers: malformedHeaders, context }),
		(error) => error === original,
	);
	assert.equal(calls, 2);
	assert.ok(records(context).some((record) => record.event === 'failure'));
	assert.ok(!JSON.stringify(records(context)).includes('key-'));
});

for (const callback of ['getExecutionId', 'getNode']) {
	test(`metadata callback ${callback} failure produces safe fallback records`, async (t) => {
		const context = makeContext();
		context[callback] = () => {
			throw new Error('private-metadata');
		};
		mockFetch(t, async () => new Response('{"ok":true}'));
		assert.deepEqual(await helpers.apiGetRequest(url, { headers, context }), [{ ok: true }]);
		const rows = records(context);
		assert.deepEqual(
			rows.map((row) => row.event),
			['request', 'response'],
		);
		assert.ok(rows.every((row) => row.diagnostic_incomplete === true));
		assert.equal(rows[1].http_status, 200);
		assert.equal(rows[1].response_received, true);
		assert.equal(rows[0].request_id, rows[1].request_id);
		const original = new TypeError('fetch failed');
		globalThis.fetch = async () => {
			throw original;
		};
		await assert.rejects(
			helpers.apiGetRequest(url, { headers, context }),
			(error) => error === original,
		);
		const failure = records(context).at(-1);
		assert.equal(failure.event, 'failure');
		assert.equal(failure.diagnostic_incomplete, true);
		assert.ok(!JSON.stringify(records(context)).includes('private-metadata'));
	});
}

test('diagnostic UUID failure cannot prevent a request', async (t) => {
	const context = makeContext();
	t.mock.method(require('node:crypto'), 'randomUUID', () => {
		throw new Error('entropy unavailable');
	});
	mockFetch(t, async () => new Response('{"ok":true}'));
	// Call the observer directly: authentication also uses randomUUID independently.
	const { withHttpDiagnostics } = require('../dist/nodes/Centum/helpers/httpDiagnostics.js');
	const result = await withHttpDiagnostics(
		url,
		{ method: 'GET' },
		{ context, debug: true },
		(response) => response.json(),
	);
	assert.deepEqual(result, { ok: true });
	assert.equal(records(context)[0].diagnostic_incomplete, true);
	assert.equal(records(context)[0].request_id, null);
});

// Legacy debug is intentionally verbose. Its payloads/gates must not inherit the
// stricter redaction or failure-handling policy of the additive HTTP observer.
for (const name of ['apiRequest', 'apiGetRequest', 'apiPostRequest', 'apiPostRequestPaginated']) {
	for (const includeRequestBody of [false, true]) {
		for (const status of [200, 500]) {
			test(`${name}: legacy debug payloads unchanged (includeBody=${includeRequestBody}, status=${status})`, async (t) => {
				const context = makeContext();
				context.getNodeParameter = (parameter, index) => {
					assert.equal(parameter, 'debugSettings');
					assert.equal(index, 3, 'both debug settings reads retain the item index');
					return {
						enableDebugLogging: true,
						includeRequestBody,
						debugEndpointContains: '  /Choferes  ',
					};
				};
				const body = { private: 'original-request-body' };
				const rawText =
					status === 200
						? '[{"private":"original-response-body"}]'
						: '{"Message":"original-error-body"}';
				const statusText = status === 200 ? 'OK' : 'Internal Server Error';
				const contentType = 'application/json; charset=utf-8';
				let targetUrl;
				let calls = 0;
				mockFetch(t, async (target, init) => {
					targetUrl = target;
					calls++;
					assert.equal(debugRecords(context)[0].event, 'Request', 'legacy request precedes fetch');
					assert.notEqual(
						init.headers.CentumSuiteAccessToken,
						'[redacted]',
						'redaction must not change authentication',
					);
					return new Response(rawText, {
						status,
						statusText,
						headers: { 'content-type': contentType },
					});
				});
				const isGet = name === 'apiGetRequest';
				const promise = helpers[name](url, {
					headers,
					context,
					debugItemIndex: 3,
					...(isGet ? {} : { method: 'POST', body }),
				});
				if (status === 200) await promise;
				else await assert.rejects(promise);
				assert.equal(calls, 1);
				const expected = [
					{
						event: 'Request',
						url: targetUrl,
						method: isGet ? 'GET' : 'POST',
						headers: {
							...(!isGet ? { 'Content-Type': 'application/json' } : {}),
							CentumSuiteConsumidorApiPublicaId: '8',
							CentumSuiteAccessToken: '[redacted]',
						},
						hasBody: !isGet,
						...(!isGet ? { bodyLength: JSON.stringify(body).length } : {}),
						...(!isGet && includeRequestBody ? { body } : {}),
					},
					{
						event: 'Response',
						url: targetUrl,
						status,
						statusText,
						contentType,
						bodyLength: rawText.length,
						body: rawText,
					},
				];
				if (!isGet && status !== 200) {
					// Baseline error-body logging depends on debug, NOT includeRequestBody.
					expected.push({ event: 'Error request body', url: targetUrl, method: 'POST', body });
				}
				assert.deepEqual(debugRecords(context), expected);
				const structured = records(context);
				assert.ok(structured.some((row) => row.event === 'response'));
				assert.ok(!JSON.stringify(structured).includes('original-'));
			});
		}
	}
	for (const debugSettings of [
		{},
		{ enableDebugLogging: false, includeRequestBody: true },
		{ enableDebugLogging: true, includeRequestBody: true, debugEndpointContains: '/Other' },
	]) {
		test(`${name}: legacy debug gates ${JSON.stringify(debugSettings)} apply to success and failure`, async (t) => {
			const context = makeContext();
			context.getNodeParameter = () => debugSettings;
			let status = 200;
			mockFetch(t, async () => new Response('[]', { status }));
			const options = { headers, context, ...(name.includes('Post') ? { body: {} } : {}) };
			await helpers[name](url, options);
			assert.equal(context.logs.length, 0);
			status = 500;
			await assert.rejects(helpers[name](url, options));
			assert.deepEqual(debugRecords(context), []);
			assert.deepEqual(
				records(context).map((row) => row.event),
				['response', 'failure'],
			);
		});
	}
}

for (const status of [200, 500]) {
	test(`apiRequest: binary legacy debug behavior unchanged for HTTP ${status}`, async (t) => {
		const context = makeContext();
		context.getNodeParameter = () => ({ enableDebugLogging: true, includeRequestBody: false });
		const body = { private: 'binary-request-body' };
		mockFetch(t, async () => new Response('binary-response', { status }));
		const promise = helpers.apiRequest(url, {
			headers,
			context,
			method: 'POST',
			body,
			responseType: 'arraybuffer',
		});
		if (status === 200) await promise;
		else await assert.rejects(promise);
		const legacy = debugRecords(context);
		assert.deepEqual(
			legacy.map((row) => row.event),
			status === 200 ? ['Request'] : ['Request', 'Error request body'],
		);
		assert.equal('body' in legacy[0], false);
		if (status !== 200)
			assert.deepEqual(legacy[1], { event: 'Error request body', url, method: 'POST', body });
	});
}

test('apiRequest: optional context and absent body retain baseline debug behavior', async (t) => {
	const context = makeContext();
	mockFetch(t, async () => new Response('failure', { status: 500 }));
	await assert.rejects(helpers.apiRequest(url, { headers }, context));
	const legacy = debugRecords(context);
	assert.deepEqual(
		legacy.map((row) => row.event),
		['Request', 'Response'],
	);
	assert.equal(legacy[0].hasBody, false);
	assert.equal(legacy[0].bodyLength, 0);
	assert.equal('body' in legacy[0], false);
	assert.equal(legacy[1].body, 'failure');
});

test('apiRequest: original error metadata log is preserved alongside structured diagnostics', async (t) => {
	const context = makeContext(false);
	const original = new TypeError('fetch failed');
	mockFetch(t, async () => {
		throw original;
	});
	await assert.rejects(helpers.apiRequest(url, { headers, context }));
	const legacy = context.logs.filter(({ args }) => args[0] === 'API request failed');
	assert.equal(legacy.length, 1);
	assert.equal(legacy[0].level, 'error');
	assert.deepEqual(legacy[0].args, ['API request failed', { error: original }]);
	assert.equal(records(context).at(-1).event, 'failure');
});

test('legacy debug logger failure retains baseline behavior rather than being silently swallowed', async (t) => {
	const context = makeContext();
	const original = new Error('legacy logger failure');
	context.logger.info = (message) => {
		if (message.startsWith('[Centum debug] ')) throw original;
	};
	const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response('[]'));
	for (const name of ['apiRequest', 'apiGetRequest', 'apiPostRequest', 'apiPostRequestPaginated']) {
		await assert.rejects(
			helpers[name](url, { headers, context, ...(name.includes('Post') ? { body: {} } : {}) }),
			(error) => error === original,
		);
	}
	assert.equal(fetchMock.mock.callCount(), 0);
});
