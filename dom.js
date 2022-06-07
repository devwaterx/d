// I might have to use es2020 imports
//import { scope } from './scope.js';

const prefix = '/go/';

function scope(script) {
	return script;
}

function rewriteUrl(rawUrl) {
	let hostname = new URL(location.href.match(new RegExp(`^(${prefix}).*`, 'g'))[0]).hostname;
	
	let url = rawUrl
	 	// /
		.replace(/^(\/)/g, `${prefix}/${hostname}/`)
		// ./
		.replace(/^(\.\/)/g, `./${hostname}/`);

	if (/^(https?:\/\/)/g.test(url))
		url = prefix + url;

	return url;
}

new MutationObserver((mutations, observer) => {
	for (let mutation of mutations) {
		const addedNode = mutation.addedNodes[0];

		// This is the only way to detect blocked scripts by mismatched integrity; I don't know why this is the case
		if (addedNode instanceof HTMLScriptElement) {
			// This is broken and causes crashes
			/*
			// Backup
			addedNode._nonce = addedNode.nonce;
			addedNode._integrity = addedNode.integrity;

			addedNode.removeAttribute('nonce');
			addedNode.removeAttribute('integrity');

			const clone = document.createElement('script');
			
			if (addedNode.src)
				clone.setAttribute('src', addedNode.getAttribute('src'));
			if (addedNode.type)
				clone.setAttribute('type', addedNode.getAttribute('type'));
			if (addedNode.async)
				clone.type = addedNode.async;
			
			clone.innerHTML = scope(addedNode.innerText);

			addedNode.after(clone);

			addedNode.remove()
			*/
		} else {
			const node = mutation.target;

			if (node.integrity) {
				node._integrity = node.integrity
				node.removeAttribute('integrity');
			}
			if (node.nonce) {
				node._nonce = node.nonce
				node.removeAttribute('nonce');
			}

			switch (node.tagName) {
			case 'A':
				if (node.href) {
					// Backup
					const href = node.getAttribute('href');

					node._href = href;

					node.setAttribute('href', rewriteUrl(href));
				}
				break;
			case 'FORM':
				if (node.action) {
					// Backup
					const action = node.getAttribute('action');

					node._action = action;

					node.setAttribute('action', rewriteUrl(action));
				}
				break;
			case 'META':
				switch (node.httpEquiv) {
					case 'content-security-policy':
						// TODO: Rewrite
						node.content = '';
					case 'refresh':
						node.content = node.content.replace(/[0-9]+;url=(.*)/g, `${prefix}/$1`)
				}
				break;
			}
		}
	}
}).observe(document, {
	childList: true,
	subtree: true
});