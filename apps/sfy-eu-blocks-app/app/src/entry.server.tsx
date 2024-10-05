import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable, type EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';

import { addDocumentResponseHeaders } from './shopify.server';

const ABORT_DELAY = 5000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
): Promise<Response> {
	addDocumentResponseHeaders(request, responseHeaders);

	const userAgent = request.headers.get('user-agent') ?? '';
	const callbackName = isbot(userAgent) ? 'onAllReady' : 'onShellReady';

	return new Promise((resolve, reject) => {
		let finalResponseStatusCode = responseStatusCode;

		const renderOptions: TRenderOptions = {
			[callbackName]: () => {
				const body = new PassThrough();
				const stream = createReadableStreamFromReadable(body);

				responseHeaders.set('Content-Type', 'text/html');

				resolve(
					new Response(stream, {
						headers: responseHeaders,
						status: finalResponseStatusCode
					})
				);

				pipe(body);
			},
			onShellError: (error) => {
				reject(error as Error);
			},
			onError: (error) => {
				finalResponseStatusCode = 500;
				console.error(error);
			}
		};

		const { pipe, abort } = renderToPipeableStream(
			<RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />,
			renderOptions
		);

		setTimeout(abort, ABORT_DELAY);
	});
}

interface TRenderOptions {
	onShellReady?: () => void;
	onAllReady?: () => void;
	onShellError: (error: unknown) => void;
	onError: (error: unknown) => void;
}
