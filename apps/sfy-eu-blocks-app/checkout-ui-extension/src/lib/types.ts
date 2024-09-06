import { FetchError, TResult } from 'feature-fetch';

export type TQuery = <
	GVariables extends Record<string, any>,
	GSucessResponseData extends Record<string, any>
>(
	query: string,
	variables: GVariables
) => Promise<TResult<GSucessResponseData, FetchError>>;
