export async function closeOffscreenDocument() {
	if (await hasOffscreenDocument()) {
		// @ts-expect-error: MV3 only API not typed
		await browser.offscreen.closeDocument();
	}
}

export async function createOffscreenDocument() {
	if (await hasOffscreenDocument()) {
		console.warn('A offscreen document already exist!');
		return;
	}

	// @ts-expect-error: MV3 only API not typed
	await browser.offscreen.createDocument({
		url: browser.runtime.getURL('/offscreen.html'),
		// @ts-expect-error: MV3 only API not typed
		reasons: [browser.offscreen.Reason.DOM_PARSER],
		justification: 'Parse DOM'
	});
}

export async function hasOffscreenDocument() {
	// @ts-expect-error: MV3 only API not typed
	const contexts = await browser.runtime?.getContexts({
		// @ts-expect-error: MV3 only API not typed
		contextTypes: [browser.runtime.ContextType.OFFSCREEN_DOCUMENT],
		documentUrls: [browser.runtime.getURL('/offscreen.html')]
	});

	if (contexts != null) {
		return contexts.length > 0;
	} else {
		// @ts-expect-error: MV3 only API not typed
		const matchedClients = await self.clients.matchAll();
		return matchedClients.some((client: any) => client.url.includes(browser.runtime.id));
	}
}
