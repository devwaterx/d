import { prefix } from './config.js';

function getRequestUrl(rawUrl, isFirstRequest, origin) {
    const url = rawUrl.replace(new RegExp(`^(${prefix})`, 'g'), '');

    if (isFirstRequest)
        return new URL(url);

    const noProtogen = url.replace(/https?:\/\//g, '');

    return new URL(`${origin}/${noProtogen}`);
}

export { getRequestUrl };