/* eslint-disable no-unused-vars */
/* global chrome */

// tabs

function getActiveTab() {
	return new Promise(resolve => {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, tabs => {
			resolve(tabs[0]);
		});
	});
}

function updateActiveTabUrl(url) {
	return new Promise(resolve => {
		getActiveTab().then(tab => {
			chrome.tabs.update(tab.id, {
				url: url
			}, resolve);
		});
	});
}

// storage

function readStorage() {
	return new Promise(resolve => {
		chrome.storage.sync.get(undefined, d => {
			resolve(d.data ? d.data : null);
		});
	});
}

function writeStorage(data) {
	return new Promise(resolve => {
		chrome.storage.sync.set({
			data: data
		}, resolve);
	});
}

function addOnStorageChangedListener(listener) {
	chrome.storage.onChanged.addListener(listener);
}

// onBeforeRequest

function addOnBeforeRequestListener(listener, urls) {
	chrome.webRequest.onBeforeRequest.addListener(listener, {
		urls: urls
	}, ['blocking']);
}

function removeOnBeforeRequestListener(listener) {
	chrome.webRequest.onBeforeRequest.removeListener(listener);
}

// runtime

function getResourceUrl(path) {
	return chrome.runtime.getURL(path);
}
