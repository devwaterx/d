import BareClient from './bareClient/BareClient.js';

import { bare, prefix } from './config.js';

import { getRequestUrl } from './getRequestUrl.js';
import { block } from './corsTest.js';
import { scope } from './scope.js';
import { filterHeaders } from './headers.js';

const bareClient = new BareClient(location.origin + bare);

async function handle(event) {
	const isFirstRequest = event.request.mode === 'navigate' && event.request.destination === 'document';

	const path = new URL(event.request.url).pathname;
	
	if (path.startsWith('/aero/'))
		return await fetch(event.request.url);

	var origin;
	if (event.clientId !== '') {
		const client = await clients.get(event.clientId);
		origin = new URL(new URL(client.url).pathname.replace(new RegExp(`^(${prefix})`, 'g'), '')).origin;
	}

	const url = getRequestUrl(path, isFirstRequest, origin);

	if (block(url.href))
		return;

	const response = await bareClient.fetch(url);

	console.log(`${event.request.url} -> ${url.href}`);

	const bareHeaders = filterHeaders(Object.fromEntries(response.headers.entries()));

	const isHtml = bareHeaders['content-type'].startsWith('text/html');

	let text;
	if (isFirstRequest && isHtml) {
		text = await response.text();
		if (text !== '')
			text = `
<!DOCTYPE html>
<head>
	<meta charset=utf-8>
	<!-- Reset favicon -->
	<link href=data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII= rel="icon" type="image/x-icon"/>

	<!-- APIs -->
	<script type=module src=/aero/api/document.js></script>
	<script type=module src=/aero/api/element.js></script>
	<script type=module src=/aero/api/history.js></script>
	<script type=module src=/aero/api/location.js></script>
	<script type=module src=/aero/api/navigator.js></script>
	<script type=module src=/aero/api/window.js></script>
	
	<!-- Interception -->
	<script src=/aero/dom.js></script>
</head>

${text}
`;

	} else if (event.request.destination === 'script')
		text = scope(await response.text());
	else if (event.request.destination === 'serviceworker')
		text = `
// Try to find if there is a better method of detection within a service worker
if (typeof module === 'undefined')
	importScripts('./gel.js');
else
	// Module imports have to be used here
	console.log('No module support');

${text}
		`;
	else
		text = response.body;

	return new Response(text, {
		status: response.status,
		headers: bareHeaders
	});
}

export { handle };