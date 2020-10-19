/* eslint-disable no-unused-vars */
/* global browser */

// tabs

async function getActiveTab() {
	const tabs = await browser.tabs.query({
		active: true
	});
	return tabs[0];
}

async function updateActiveTabUrl(url) {
	const tab = await getActiveTab();
	await browser.tabs.update(tab.id, {
		url: url
	});
}

// storage

async function readStorage() {
	return await browser.storage.sync.get();
}

async function writeStorage(data) {
	await browser.storage.sync.set(data);
}

function addOnStorageChangedListener(listener) {
	browser.storage.onChanged.addListener(listener);
}

// onBeforeRequest

function addOnBeforeRequestListener(listener, urls) {
	browser.webRequest.onBeforeRequest.addListener(listener, {
		urls: urls
	}, ['blocking']);
}

function removeOnBeforeRequestListener(listener) {
	browser.webRequest.onBeforeRequest.removeListener(listener);
}

// runtime

function getResourceUrl(path) {
	return browser.runtime.getURL(path);
}
