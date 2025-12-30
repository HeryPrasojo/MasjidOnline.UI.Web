(async () =>
{
	const sessionIdHeaderName = 'Mo-Sess';

	mo.fetch = async (url, options) =>
	{
		// url = url.replace(/^\|+|\|+$/g, '');

		const response = await fetch(url, options);

		// if (!response.ok) throw Error(response.status + ' ' + response.statusText);

		return response;
	};

	mo.fetchText = async (url, options) =>
	{
		const response = await mo.fetch(url, options);

		return await response.text();
	};

	mo.fetchApi = async (url, options) =>
	{
		options ??= {};
		options.method = 'POST';

		options.headers ??= new Headers();

		if (typeof options.body != 'undefined' && !(options.body instanceof FormData))
		{
			const hasContentType = options.headers.has("Content-Type");

			if (!hasContentType) options.headers.append("Content-Type", "application/json");

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

			resultCode = json.ResultCode;

			// if (json.ResultCode) throw Error(json.ResultCode + ' ' + json.ResultMessage);
		}
		else
		{
			resultCode = response.headers.get("Mo-Result-Code");

			// if (resultCode) throw Error(resultCode + ' ' + response.headers.get("Mo-Result-Message"));
		}

		if (resultCode == 5)
		{
			mo.removeSession();

			options.headers.delete(sessionIdHeaderName);

			return mo.fetchApi(url, options);
		}

		return response;
	};

	mo.fetchApiJson = async (url, options) =>
	{
		const response = await mo.fetchApi(url, options);

		return await response.json();
	};


	mo.fetchAnonymInfaqBankTransfer = async (formData) =>
	{
		await addRequestCaptchaToken(formData, 'infaq');

		return await mo.fetchApiJson('infaq/infaq/add/anonym', { body: formData });
	};

	mo.fetchInfaqList = async (body) =>
	{
		return await mo.fetchApiJson('infaq/infaq/getMany', { body });
	};

	mo.fetchLogin = async (body) =>
	{
		await addRequestCaptchaToken(body, 'login');

		return await mo.fetchApiJson('user/login', { body });
	};

	mo.fetchRegister = async (body) =>
	{
		await addRequestCaptchaToken(body, 'register');

		return await mo.fetchApiJson('user/register', { body });
	};

	mo.fetchSetPassword = async (body) =>
	{
		await addRequestCaptchaToken(body, 'verifySetPassword');

		return await mo.fetchApiJson('user/verifySetPassword', { body });
	};

	mo.fetchVerifyRegister = async (body) =>
	{
		await addRequestCaptchaToken(body, 'verifyRegister');

		return await mo.fetchApiJson('user/verifyRegister', { body });
	};


	async function addRequestCaptchaToken(body, action)
	{
		const captchaToken = await getCaptchaToken(action);

		if (body instanceof FormData)
		{
			if (!body.has('CaptchaToken'))
				body.append('CaptchaToken', captchaToken);
		}
		else
		{
			if (!body.CaptchaToken)
				body.CaptchaToken = captchaToken;
		}
	}

	async function getCaptchaToken(action)
	{
		return await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: action + mo.recaptchaActionAffix });
	}

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
						ApplicationCulture: 1, // english
						CaptchaToken: await getCaptchaToken('session'),
					},
				});

			if (json.ResultCode) return;

			sessionId = json.Data;

			mo.setSession(sessionId);
		}

		return sessionId;
	};
})();
