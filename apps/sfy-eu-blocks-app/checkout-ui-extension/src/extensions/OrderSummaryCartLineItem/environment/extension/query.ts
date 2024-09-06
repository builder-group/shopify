import { Err, FetchError, Ok, TResult } from 'feature-fetch';

import { cx } from './context';

export async function q<
	GVariables extends Record<string, any>,
	GSucessResponseData extends Record<string, any>
>(query: string, variables: GVariables): Promise<TResult<GSucessResponseData, FetchError>> {
	const result = await cx().query<GSucessResponseData, GVariables>(query, {
		variables
	});

	if (result.data == null) {
		return Err(new FetchError('#ERR_GRAPHQL', { description: result.errors?.[0]?.message }));
	}

	return Ok(result.data);
}
