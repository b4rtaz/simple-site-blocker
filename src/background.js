/* global readStorage */
/* global getResourceUrl */
/* global removeOnBeforeRequestListener */
/* global addOnBeforeRequestListener */
/* global addOnStorageChangedListener */

async function getConfig() {
	const config = await readStorage();
	return config ? config : {
		enabled: true,
		blockedHosts: []
	};
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
