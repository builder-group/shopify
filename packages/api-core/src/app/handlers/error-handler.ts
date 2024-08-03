import { AppError } from '@blgc/openapi-router';
import { type components } from '@repo/types/core';
import { HTTPException } from 'hono/http-exception';
import type * as hono from 'hono/types';
import { type StatusCode } from 'hono/utils/http-status';
import { logger } from '@/logger';

type HeaderRecord = Record<string, string | string[]>;

export const errorHandler: hono.ErrorHandler = async (err, c) => {
	let statusCode = 500;
	let headers: HeaderRecord = {};
	const jsonResponse: components['schemas']['AppErrorDto'] = {
		error_code: '#ERR_UNKNOWN',
		error_description: null,
		error_uri: null,
		additional_errors: []
	};

	// Handle application-specific errors (instances of AppError)
	if (err instanceof AppError) {
		statusCode = err.status;
		jsonResponse.error_code = err.code;
		jsonResponse.error_description = err.description ?? null;
		jsonResponse.error_uri = err.uri ?? null;
		jsonResponse.additional_errors = err.additionalErrors as any;
	}

	// Handle Hono's application-specific errors (instance of HTTPException)
	// e.g. thrown in 'bearer-auth' middleware, ..
	else if (err instanceof HTTPException) {
		const response = err.getResponse();

		if (response.status === 400) {
			statusCode = response.status;
			jsonResponse.error_code = '#ERR_BAD_REQUEST';
			jsonResponse.error_description = await response.text();

			const newHeaders = Object.fromEntries(response.headers.entries());
			delete newHeaders['content-type'];
			headers = newHeaders;
		}

		if (response.status === 401) {
			statusCode = response.status;
			jsonResponse.error_code = '#UNAUTHORIZED';
			jsonResponse.error_description = await response.text();

			const newHeaders = Object.fromEntries(response.headers.entries());
			delete newHeaders['content-type'];
			headers = newHeaders;
		}
	}

	// Handle unknown errors
	else if (typeof err === 'object') {
		if ('message' in err && typeof err.message === 'string') {
			jsonResponse.error_description = err.message;
		}
		if ('code' in err && typeof err.code === 'string') {
			jsonResponse.error_code = err.code;
		}
	} else {
		jsonResponse.error_description = 'An unknown error occurred!';
	}

	logger.error(`Error Response: ${statusCode.toString()}`, { jsonResponse, headers });

	return c.json(jsonResponse, statusCode as StatusCode, headers);
};
