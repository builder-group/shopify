import { Tabs } from 'wxt/browser';

export async function queryActiveTab(): Promise<Tabs.Tab> {
	const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
	return tab;
}
