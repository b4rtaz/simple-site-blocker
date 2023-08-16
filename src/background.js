/* global readStorage */
/* global getResourceUrl */
/* global removeOnBeforeRequestListener */
/* global addOnBeforeRequestListener */
/* global addOnStorageChangedListener */

async function getConfig() {
	// // This function should have the same logic as the function from popup.js
	const config = await readStorage();
	// Check the extension data to make sure it is not empty.
	// If an empty object is received, initialize default parameters.
	if (Object.keys(config).length <= 0) {
		const defaultConfig = {
			enabled: true,
			blockedHosts: []
		};
		await writeStorage(defaultConfig);
		return defaultConfig;
	}
	
	return config;
}

function block(request) {
	const url = getResourceUrl('blocked.html') + '#url=' + encodeURIComponent(request.url);
	return {
		redirectUrl: url
	};
}

async function reloadBlocker() {
	removeOnBeforeRequestListener(block);

	const config = await getConfig();
	if (config.enabled) {
		const urls = [];
		for (let i = 0; i < config.blockedHosts.length; i++) {
			urls.push('*://' + config.blockedHosts[i] + '/*');
		}
		if (urls.length > 0) {
			addOnBeforeRequestListener(block, urls);
		}
	}
}

reloadBlocker();
addOnStorageChangedListener(reloadBlocker);
