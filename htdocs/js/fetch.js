(async () =>
{
	const sessionIdHeaderName = 'Mo-Sess';

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


		if (url != 'session/create')
		{
			const sessionId = await getSession();

			if (!sessionId) return;

			options.headers.append(sessionIdHeaderName, sessionId);
		}


		const response = await mo.fetch(mo.apiUriPrefix + url, options);

		if (response.status != 200)
		{
			console.error(`response.status: ${response.status} ${response.statusText}`);

			return {
				resultCode: 'fetch failed',
				resultMessage: `response.status: ${response.status} ${response.statusText}`,
			};
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

			options.headers.delete(sessionIdHeaderName);

			return mo.fetchApi(url, options);
		}

		return response;
	};

	mo.fetchApiJson = async function (url, options)
	{
		const response = await mo.fetchApi(url, options);

		return await response.json();
	};


	async function getSession()
	{
		let sessionId = mo.getSession();

		if (!sessionId)
		{
			const json = await mo.fetchApiJson(
				'session/create',
				{
					body:
					{
						captchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'session' + mo.recaptchaActionAffix }),
					},
				});

			if (json.resultCode) return;

			sessionId = json.data;

			mo.setSession(sessionId);
		}

		return sessionId;
	};
})();
