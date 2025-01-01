async function moFetch(url, options)
{
	const response = await fetch(url, options);

	if (!response.ok) throw new Error(response);

	return response;
}

async function moFetchApi(url, options)
{
	options.method = 'POST';

	return await moFetch(globalThis.moApiUriPrefix + url, options);
}

async function moFetchText(url, options)
{
	const response = await moFetch(url, options);

	return await response.text();
}
