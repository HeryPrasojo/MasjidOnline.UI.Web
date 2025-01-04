globalThis.moHttpHeaderName =
{
	resultCode: 'Mo-Result-Code',
};

globalThis.moApiResultCode =
{
	success: 'Success',
	captchaPassed: 'CaptchaPassed',
};

async function moFetch(url, options)
{
	const response = await fetch(url, options);

	if (!response.ok) throw new Error(response);

	return response;
}

async function moFetchApi(url, options)
{
	options ??= {};
	
	options.method = 'POST';

	options.credentials = 'include';

	return await moFetch(globalThis.moApiUriPrefix + url, options);
}

async function moFetchText(url, options)
{
	const response = await moFetch(url, options);

	return await response.text();
}
