import { Err, FetchError, getQueryString, Ok, TDocumentInput, TResult } from 'feature-fetch';

import { cx } from './context';

export async function q<
	GSucessResponseData extends Record<string, any>,
	GVariables extends Record<string, any>
>(
	query: TDocumentInput<GSucessResponseData, GVariables>,
	variables: GVariables
): Promise<TResult<GSucessResponseData, FetchError>> {
	const maybeQueryString = getQueryString(query);
	if (maybeQueryString.isErr()) {
		return Err(maybeQueryString.error);
	}

	const result = await cx().query<GSucessResponseData, GVariables>(maybeQueryString.value, {
		variables
	});

	if (result.data == null) {
		return Err(new FetchError('#ERR_GRAPHQL', { description: result.errors?.[0]?.message }));
	}

	return Ok(result.data);
}
