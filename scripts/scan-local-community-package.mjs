import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = path.resolve('dist');

const checks = [
	{ label: 'console statement', regex: /\bconsole\./ },
	{ label: 'restricted global setTimeout', regex: /\bsetTimeout\s*\(/ },
	{ label: 'process.env usage', regex: /\bprocess\.env\b/ },
	{ label: 'fs module import', regex: /require\(['"]fs['"]\)|from ['"]fs['"]/ },
	{ label: 'path module import', regex: /require\(['"]path['"]\)|from ['"]path['"]/ },
	{ label: 'os module import', regex: /require\(['"]os['"]\)|from ['"]os['"]/ },
	{
		label: 'child_process import',
		regex: /require\(['"]child_process['"]\)|from ['"]child_process['"]/,
	},
];

async function collectJsFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await collectJsFiles(fullPath)));
			continue;
		}

		if (entry.isFile() && fullPath.endsWith('.js')) {
			files.push(fullPath);
		}
	}

	return files;
}

async function main() {
	const files = await collectJsFiles(rootDir);
	const violations = [];

	for (const file of files) {
		const content = await readFile(file, 'utf8');
		const lines = content.split(/\r?\n/);

		for (let index = 0; index < lines.length; index++) {
			for (const check of checks) {
				if (check.regex.test(lines[index])) {
					violations.push({
						file: path.relative(process.cwd(), file),
						line: index + 1,
						label: check.label,
						content: lines[index].trim(),
					});
				}
			}
		}
	}

	if (violations.length === 0) {
		process.stdout.write('Local community-package scan passed.\n');
		return;
	}

	for (const violation of violations) {
		process.stdout.write(
			`${violation.file}:${violation.line} ${violation.label}\n  ${violation.content}\n`,
		);
	}

	process.exitCode = 1;
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
