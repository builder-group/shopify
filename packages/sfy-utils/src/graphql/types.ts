import { type FetchError, type TDocumentInput, type TResult } from 'feature-fetch';

export type TQuery = <
	GSucessResponseData extends Record<string, any>,
	GVariables extends Record<string, any>
>(
	query: TDocumentInput<GSucessResponseData, GVariables> | string,
	variables: GVariables
) => Promise<TResult<GSucessResponseData, FetchError>>;
