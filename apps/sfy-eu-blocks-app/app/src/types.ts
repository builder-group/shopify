import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type TypedResponse
} from '@remix-run/node';

/**
 * A function that loads data for a route on the server
 */
export type TLoaderFunction<GResponse = null> = (args: LoaderFunctionArgs) => Promise<GResponse>;

export type TJsonLoaderFunction<GResponse> = (
	args: LoaderFunctionArgs
) => Promise<TypedResponse<GResponse>>;

/**
 * A function that handles data mutations for a route on the server
 */
export type TActionFunction<GResponse = null> = (args: ActionFunctionArgs) => Promise<GResponse>;

export type TJsonActionFunction<GResponse> = (
	args: ActionFunctionArgs
) => Promise<TypedResponse<GResponse>>;
