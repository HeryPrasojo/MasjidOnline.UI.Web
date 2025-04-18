globalThis.mo ??= {};

mo.apiResultCode =
{
	success: 0,
	sessionMismatch: 3,
	sessionExpire: 5,
	inputInvalid: 11,
	captchaPass: 111,
	captchaUnneed: 114,
	captchaUnpass: 115,
};

mo.fetch = async function (url, options)
{
	url = url.replace(/^\|+|\|+$/g, '');

	const response = await fetch(url, options);

	if (!response.ok) throw Error(response.status + ' ' + response.statusText);

	return response;
};

mo.fetchText = async function (url, options)
{
	const response = await mo.fetch(url, options);

	return await response.text();
};

mo.fetchApi = async function (url, options)
{
	options ??= {};
	options.method = 'POST';

	options.headers ??= new Headers();

	if (typeof options.body != 'undefined' && !(options.body instanceof FormData))
		options.headers.append("Content-Type", "application/json");


	const sessionId = await mo.getSession();

	if (sessionId) options.headers.append(mo.sessionIdHeaderName, sessionId);


	const response = await mo.fetch(mo.apiUriPrefix + url, options);


	const contentType = response.headers.get('Content-Type');

	if (contentType.indexOf('application/json') > -1)
	{
		const json = await response.clone().json();

		const resultCode = json.resultCode;
		if (resultCode != mo.apiResultCode.success)
		{
			if (resultCode == mo.apiResultCode.sessionExpire) throw Error(resultCode);

			throw Error(resultCode + ' ' + json.resultMessage);
		}
	}

	if (!sessionId)
	{
		const sessionId = response.headers.get(mo.sessionIdHeaderName);

		mo.setSession(sessionId);
	}

	return response;
};

mo.fetchApiJson = async function (url, options)
{
	const response = await mo.fetchApi(url, options);

	return await response.json();
};
