import { type components, type paths } from '@repo/types/core';
import { Session } from '@shopify/shopify-api';
import { type SessionStorage } from '@shopify/shopify-app-session-storage';
import { createOpenApiFetchClient, RequestError, type TFetchClient } from 'feature-fetch';

export class ApiCoreSessionStorage implements SessionStorage {
	private fetchClient: TFetchClient<['base', 'openapi'], paths>;

	constructor(basePath: string) {
		this.fetchClient = createOpenApiFetchClient<paths>({
			prefixUrl: basePath
		});
	}

	async storeSession(session: Session): Promise<boolean> {
		const response = await this.fetchClient.post(
			'/v1/shopify/session',
			sessionToSessionDto(session)
		);

		if (response.isErr() && response.error instanceof RequestError) {
			console.warn('Failed to store Session by exception.', {
				errorData: response.error.data,
				sessionDto: sessionToSessionDto(session),
				e: response
			});
		}

		return response.isOk();
	}

	async loadSession(id: string): Promise<Session | undefined> {
		const response = await this.fetchClient.get('/v1/shopify/session/{id}', {
			pathParams: {
				id
			}
		});

		if (response.isOk()) {
			return sessionDtoToSession(response.value.data);
		}

		return undefined;
	}

	async deleteSession(id: string): Promise<boolean> {
		const response = await this.fetchClient.del('/v1/shopify/session/{id}', {
			pathParams: {
				id
			}
		});

		return response.isOk();
	}

	async deleteSessions(ids: string[]): Promise<boolean> {
		const response = await this.fetchClient.post('/v1/shopify/session/delete', ids);

		return response.isOk();
	}

	async findSessionsByShop(shop: string): Promise<Session[]> {
		const response = await this.fetchClient.get('/v1/shopify/session/shop/{shop}', {
			pathParams: {
				shop
			}
		});

		if (response.isOk()) {
			return response.value.data.map((sessionDto) => sessionDtoToSession(sessionDto));
		}

		return [];
	}
}

function sessionToSessionDto(session: Session): components['schemas']['ShopifySessionDto'] {
	return {
		id: session.id,
		shop: session.shop,
		state: session.state,
		isOnline: session.isOnline,
		scope: session.scope,
		expires: session.expires?.getTime(),
		accessToken: session.accessToken,
		userId: session.onlineAccessInfo?.associated_user.id
	};
}

function sessionDtoToSession(sessionDto: components['schemas']['ShopifySessionDto']): Session {
	const sessionParams: Record<string, boolean | string | number> = {
		id: sessionDto.id,
		shop: sessionDto.shop,
		state: sessionDto.state,
		isOnline: sessionDto.isOnline
	};

	if (sessionDto.expires != null) {
		sessionParams.expires = sessionDto.expires;
	}

	if (sessionDto.scope != null) {
		sessionParams.scope = sessionDto.scope;
	}

	if (sessionDto.accessToken != null) {
		sessionParams.accessToken = sessionDto.accessToken;
	}

	if (sessionDto.userId != null) {
		sessionParams.onlineAccessInfo = sessionDto.userId;
	}

	return Session.fromPropertyArray(Object.entries(sessionParams));
}
