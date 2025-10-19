const sessionIdHeaderName = 'Mo-Sess';
const sessionIdStorageKey = 'sessionId';
const isLoggedInStorageKey = 'isLoggedIn';

await import('/js/envConfig.js');

mo.fetch = async function (url, options)
{
	// url = url.replace(/^\|+|\|+$/g, '');

	const response = await fetch(url, options);

	// if (!response.ok) throw Error(response.status + ' ' + response.statusText);

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
	{
		options.headers.append("Content-Type", "application/json");

		options.body = JSON.stringify(options.body);
	}


	const sessionId = mo.getSession();

	if (sessionId) options.headers.append(sessionIdHeaderName, sessionId);


	const response = await mo.fetch(mo.apiUriPrefix + url, options);

	if (response.status != 200)
	{
		return {
			resultMessage: 'Network error',
		}
	}


	let resultCode;

	const contentType = response.headers.get('Content-Type');

	if (contentType && contentType.indexOf('application/json') > -1)
	{
		const json = await response.clone().json();

		resultCode = json.resultCode;

		// if (json.resultCode) throw Error(json.resultCode + ' ' + json.resultMessage);
	}
	else
	{
		resultCode = response.headers.get("Mo-Result-Code");

		// if (resultCode) throw Error(resultCode + ' ' + response.headers.get("Mo-Result-Message"));
	}

	if (resultCode == "SessionExpire")
	{
		mo.removeSession();

		location.href = '/captcha?r=' + encodeURIComponent(location.href);

		return {
			resultMessage: 'SessionExpire',
		}
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

mo.removeSession = function ()
{
	localStorage.removeItem(sessionIdStorageKey);

	mo.removeIsLoggedIn();
};

mo.setSession = function (sessionId)
{
	localStorage.setItem(sessionIdStorageKey, sessionId);
};


mo.removeIsLoggedIn = function ()
{
	localStorage.removeItem(isLoggedInStorageKey);
};

mo.getIsLoggedIn = function ()
{
	return localStorage.getItem(isLoggedInStorageKey);
}

mo.setLoggedIn = function ()
{
	localStorage.setItem(isLoggedInStorageKey, true);
}
