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

	const loadingShown = mo.showLoading('Sending data');

	const response = await fetch(url, options);

	if (loadingShown) mo.closeLoading();

	if (!response.ok) mo.showError(response);

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

		if (json.resultCode != mo.apiResultCode.success)
		{
			if (json.resultCode == mo.apiResultCode.sessionExpire)
				await mo.showError('Session expired. Please reload/refresh this page.');

			await mo.showError(json);
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
