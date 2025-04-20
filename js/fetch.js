(function ()
{
	const sessionIdHeaderName = 'Mo-Sess';
	const sessionIdStorageKey = 'sessionId';
	const captchaPassedStorageKey = 'isCaptchaPassed';

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


		const sessionId = mo.getSession();

		if (sessionId) options.headers.append(sessionIdHeaderName, sessionId);


		const response = await mo.fetch(mo.apiUriPrefix + url, options);


		const contentType = response.headers.get('Content-Type');

		if (contentType.indexOf('application/json') > -1)
		{
			const json = await response.clone().json();

			if (json.resultCode != 0) throw Error(json.resultCode + ' ' + json.resultMessage);
		}
		else
		{
			const resultCode = response.headers.get("Mo-Result-Code");

			if (resultCode != 0) throw Error(resultCode + ' ' + response.headers.get("Mo-Result-Message"));
		}

		if (!sessionId)
		{
			const sessionId = response.headers.get(sessionIdHeaderName);

			if (sessionId) mo.setSession(sessionId);
		}

		return response;
	};

	mo.fetchApiJson = async function (url, options)
	{
		const response = await mo.fetchApi(url, options);

		return await response.json();
	};

	mo.getSession = function ()
	{
		return localStorage.getItem(sessionIdStorageKey);
	};

	mo.setSession = function (sessionId)
	{
		localStorage.setItem(sessionIdStorageKey, sessionId);
	};

	mo.isCaptchaNeeded = function ()
	{
		const sessionId = mo.getSession();

		if (!sessionId) return true;


		const isLogin = localStorage.getItem('isLogin');

		if (isLogin != null) return false;


		const isCaptchaPassed = localStorage.getItem(captchaPassedStorageKey);

		if (isCaptchaPassed != null) return false;


		return true;
	}

	mo.setCaptchaPassed = function ()
	{
		localStorage.setItem(captchaPassedStorageKey, true);
	}
})();
