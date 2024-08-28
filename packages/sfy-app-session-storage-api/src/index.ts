import { type shopifyApiV1 } from '@repo/types/api';
import { Session } from '@shopify/shopify-api';
import { type SessionStorage } from '@shopify/shopify-app-session-storage';
import { createOpenApiFetchClient, RequestError, type TFetchClient } from 'feature-fetch';

// TODO: Create cache because Shopify seems to query the session quite often
// TODO: Improve id handling. Creating a joined primary key with id and app might be better than modifying the id.
export class ApiCoreSessionStorage implements SessionStorage {
	private readonly fetchClient: TFetchClient<['base', 'openapi'], shopifyApiV1.paths>;
	private readonly app: string;
	private readonly sessionIdAppPrefix: string;

	constructor(basePath: string, shopifyToken: string, app: string) {
		this.app = app;
		this.sessionIdAppPrefix = `${this.app}_`;
		this.fetchClient = createOpenApiFetchClient<shopifyApiV1.paths>({
			prefixUrl: basePath,
			beforeRequestMiddlewares: [
				async (data) => {
					(data.requestInit.headers as Record<string, string>).Authorization =
						`Bearer ${shopifyToken}`;
					return data;
				}
			]
		});
	}

	public async storeSession(session: Session): Promise<boolean> {
		const response = await this.fetchClient.post('/session', this.sessionToSessionDto(session));

		if (response.isErr() && response.error instanceof RequestError) {
			console.warn('Failed to store Session by exception.', {
				errorData: response.error.data,
				sessionDto: this.sessionToSessionDto(session),
				e: response
			});
		}

		return response.isOk();
	}

	public async loadSession(id: string): Promise<Session | undefined> {
		const response = await this.fetchClient.get('/session/{id}', {
			pathParams: {
				id: this.createSessionIdWithAppPrefix(id)
			}
		});

		if (response.isOk()) {
			return this.sessionDtoToSession(response.value.data);
		}

		return undefined;
	}

	public async deleteSession(id: string): Promise<boolean> {
		const response = await this.fetchClient.del('/session/{id}', {
			pathParams: {
				id: this.createSessionIdWithAppPrefix(id)
			}
		});

		return response.isOk();
	}

	public async deleteSessions(ids: string[]): Promise<boolean> {
		const response = await this.fetchClient.post(
			'/session/delete',
			ids.map((id) => this.createSessionIdWithAppPrefix(id))
		);

		return response.isOk();
	}

	public async findSessionsByShop(shop: string): Promise<Session[]> {
		const response = await this.fetchClient.get('/session/shop/{shop}', {
			pathParams: {
				shop
			}
		});

		if (response.isOk()) {
			return response.value.data
				.filter((sessionDto) => sessionDto.app === this.app)
				.map((sessionDto) => this.sessionDtoToSession(sessionDto));
		}

		return [];
	}

	// TODO: Can we improve this id? Use database controlled id? Or use joined primary key with id and app?
	private createSessionIdWithAppPrefix(sessionIdWithoutAppPrefix: Session['id']): string {
		// [app]_[scope]_[shop] (e.g. playground_offline_bennos-dev-store.myshopify.com)
		return `${this.sessionIdAppPrefix}${sessionIdWithoutAppPrefix}`;
	}

	private sessionToSessionDto(
		session: Session
	): shopifyApiV1.components['schemas']['ShopifySessionDto'] {
		return {
			id: this.createSessionIdWithAppPrefix(session.id),
			app: this.app,
			shop: session.shop,
			state: session.state,
			isOnline: session.isOnline,
			scope: session.scope,
			expires: session.expires?.getTime(),
			accessToken: session.accessToken,
			userId: session.onlineAccessInfo?.associated_user.id
		};
	}

	private sessionDtoToSession(
		sessionDto: shopifyApiV1.components['schemas']['ShopifySessionDto']
	): Session {
		const sessionParams: Record<string, boolean | string | number> = {
			id: sessionDto.id.replace(this.sessionIdAppPrefix, ''),
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
}
