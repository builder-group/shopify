import { type Session } from '@shopify/shopify-api';
import { type SessionStorage } from '@shopify/shopify-app-session-storage';

export class LocalSessionStorage implements SessionStorage {
	private sessions = new Map<string, Session>();

	async storeSession(session: Session): Promise<boolean> {
		// console.log('[LocalSessionStorage.storeSession]', {
		// 	session,
		// 	sessions: Object.fromEntries(this.sessions)
		// });
		this.sessions.set(session.id, session);
		return true;
	}

	async loadSession(id: string): Promise<Session | undefined> {
		// console.log('[LocalSessionStorage.loadSession]', {
		// 	id,
		// 	sessions: Object.fromEntries(this.sessions)
		// });
		return this.sessions.get(id);
	}

	async deleteSession(id: string): Promise<boolean> {
		// console.log('[LocalSessionStorage.deleteSession]', {
		// 	id,
		// 	sessions: Object.fromEntries(this.sessions)
		// });
		return this.sessions.delete(id);
	}

	async deleteSessions(ids: string[]): Promise<boolean> {
		// console.log('[LocalSessionStorage.deleteSessions]', {
		// 	ids,
		// 	sessions: Object.fromEntries(this.sessions)
		// });
		let success = true;
		ids.forEach((id) => {
			if (!this.sessions.delete(id)) {
				success = false;
			}
		});
		return success;
	}

	async findSessionsByShop(shop: string): Promise<Session[]> {
		// console.log('[LocalSessionStorage.findSessionsByShop]', {
		// 	shop,
		// 	sessions: Object.fromEntries(this.sessions)
		// });
		const sessions: Session[] = [];
		this.sessions.forEach((session) => {
			if (session.shop === shop) {
				sessions.push(session);
			}
		});
		return sessions;
	}
}
