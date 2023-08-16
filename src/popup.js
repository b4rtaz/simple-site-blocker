/* global getActiveTab */
/* global getResourceUrl */
/* global updateActiveTabUrl */
/* global readStorage */
/* global writeStorage */

let config;
let enabledSwitch;
let siteBox;
let siteName;
let siteBlockedSwitch;
let tabUrl;

async function getCurrentTabUrl() {
	const tab = await getActiveTab();
	const url = new URL(tab.url);

	if (url.protocol === 'https:' || url.protocol === 'http:') {
		return url;
	}

	const blockedUrl = new URL(getResourceUrl('blocked.html'));
	if (url.protocol === blockedUrl.protocol &&
		url.host === blockedUrl.host &&
		url.pathname === blockedUrl.pathname &&
		url.hash)
	{
		const params = new URLSearchParams(url.hash.substr(1));
		if (params.get('url')) {
			return new URL(params.get('url'));
		}
	}

	return null;
}

async function setCurrentTabUrl(url) {
	await updateActiveTabUrl(url);
}

async function getConfig() {
	const config = await readStorage();
	// Check the extension data to make sure it is not empty.
	// If an empty object is received, initialize default parameters.
	if (Object.keys(config).length <= 0) {
		await writeStorage({
			enabled: true,
			blockedHosts: []
		});
	}
	
	return config;
}

async function updateConfig() {
	await writeStorage(config);
}

async function isHostBlocked() {
	return config.blockedHosts.indexOf(tabUrl.host) >= 0;
}

function setSwitchValue(s, value) {
	s.setAttribute('data-value', value ? '1' : '0');
}

function getSwitchValue(s) {
	return s.getAttribute('data-value') === '1' ? true : false;
}

async function onEnabledSwitchClicked(event) {
	event.preventDefault();

	const value = !getSwitchValue(enabledSwitch);
	setSwitchValue(enabledSwitch, value);

	config.enabled = value;

	await updateConfig();
	if (tabUrl) {
		await setCurrentTabUrl(tabUrl.href);
	}
}

async function onSiteBlockedSwitchClicked(event) {
	event.preventDefault();

	const value = !getSwitchValue(siteBlockedSwitch);
	setSwitchValue(siteBlockedSwitch, value);

	if (value) {
		config.blockedHosts.push(tabUrl.host);
	} else {
		const index = config.blockedHosts.indexOf(tabUrl.host);
		config.blockedHosts.splice(index, 1);
	}

	await updateConfig();
	if (tabUrl) {
		await setCurrentTabUrl(tabUrl.href);
	}
}

window.addEventListener('DOMContentLoaded', async () => {
	enabledSwitch = document.getElementById('enabled-switch');
	enabledSwitch.addEventListener('click', onEnabledSwitchClicked);
	siteBox = document.getElementById('site-box');
	siteName = document.getElementById('site-name');
	siteBlockedSwitch = document.getElementById('site-blocked-switch');
	siteBlockedSwitch.addEventListener('click', onSiteBlockedSwitchClicked);

	tabUrl = await getCurrentTabUrl();

	config = await getConfig();
	setSwitchValue(enabledSwitch, config.enabled);

	if (tabUrl) {
		siteName.innerText = tabUrl.host;
		setSwitchValue(siteBlockedSwitch, await isHostBlocked());
	} else {
		siteBox.style.display = 'none';
	}
});
