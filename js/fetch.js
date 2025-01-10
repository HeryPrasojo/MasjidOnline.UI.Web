globalThis.moHttpHeaderName =
{
	resultCode: 'Mo-Result-Code',
};

globalThis.moApiResultCode =
{
	success: 0,
	captchaPassed: 111,
	captchaWrong: 112
};
globalThis.moApiHeaderResultCode =
{
	success: 'Success',
	captchaPassed: 'CaptchaPassed'
};

async function moFetch(url, options)
{
	const response = await fetch(url, options);

	if (!response.ok) throw new Error(response);

	return response;
}

async function moFetchText(url, options)
{
	const response = await moFetch(url, options);

	return await response.text();
}

async function moFetchApi(url, options)
{
	options ??= {};
	options.method = 'POST';
	options.credentials = 'include';
	
	options.headers ??= new Headers();
	options.headers.append("Content-Type", "application/json");

	return await moFetch(globalThis.moApiUriPrefix + url, options);
}

async function moFetchApiJson(url, options)
{
	const response = await moFetchApi(url, options);
	
	return await response.json();
}
