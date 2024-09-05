import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { tunnel } from 'cloudflared';

const filesToUpdate = [
	path.join(
		__dirname,
		'../sfy-eu-blocks-app/admin-block-extension/src/environment/config/core-api.config.ts'
	),
	path.join(
		__dirname,
		'../sfy-eu-blocks-app/checkout-ui-extension/src/CheckoutCartLineItem/environment/config/core-api.config.ts'
	)
];

async function updateConfigFiles(tunnelUrl) {
	for (const filePath of filesToUpdate) {
		try {
			let content = await fs.readFile(filePath, 'utf-8');
			content = content.replace(/(baseUrl:\s*)'[^']*'/, `$1'${tunnelUrl}'`);
			await fs.writeFile(filePath, content, 'utf-8');
			console.log(`Updated ${path.basename(filePath)}`);
		} catch (error) {
			console.error(`Error updating ${filePath}:`, error);
		}
	}
}

(async () => {
	console.log('Starting Cloudflare tunnel...');
	const { url, connections, stop } = tunnel({ '--url': 'http://localhost:8787' });

	try {
		const tunnelUrl = await url;
		console.log(`Cloudflare tunnel URL: ${tunnelUrl}`);
		await updateConfigFiles(tunnelUrl);

		const conns = await Promise.all(connections);
		console.log('Tunnel connections established:', conns);

		// Start the application using tsx watch
		const app = spawn('tsx', ['watch', './src/index.ts'], { stdio: 'inherit' });

		app.on('error', (error) => {
			console.error('Failed to start application:', error);
		});

		// Handle SIGINT (Ctrl+C) to gracefully stop both the tunnel and the application
		process.on('SIGINT', async () => {
			console.log('Stopping tunnel and application...');
			app.kill();
			await stop();
			process.exit();
		});
	} catch (error) {
		console.error('Error setting up tunnel:', error);
		process.exit(1);
	}
})();
