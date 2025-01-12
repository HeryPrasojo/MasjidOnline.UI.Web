async function moCreateCaptchaQuestion()
{
	const isUserSessionExists = moCheckUserSessionExists();

	if (isUserSessionExists) return 1;


	const holder = moGetElement('captchaHolder');

	const text = await moFetchText('/html/captcha.html');

	holder.innerHTML = text;


	const imageElement = moGetElement('captchaImage');

	const loadingElement = moGetElement('captchaLoading');

	const wrongMessageElement = moGetElement('captchaWrongMessage');

	const result = await fetchCaptcha();

	if (result == 1) return 1;


	const decreaseDegreeElement = moGetElement('captchaDecreaseDegree');

	decreaseDegreeElement.addEventListener('click', decreaseDegree);


	const increaseDegreeElement = moGetElement('captchaIncreaseDegree');

	increaseDegreeElement.addEventListener('click', increaseDegree);


	const submitElement = moGetElement('captchaSubmit');

	submitElement.addEventListener('click', submitCaptcha);


	function decreaseDegree()
	{
		var degree = +imageElement.dataset.degree - 45;

		if (degree < 0) degree = 315;

		imageElement.dataset.degree = degree;

		imageElement.style.transform = 'rotate(' + degree + 'deg)';
	}

	function increaseDegree()
	{
		var degree = +imageElement.dataset.degree + 45;

		if (degree > 315) degree = 0;

		imageElement.dataset.degree = degree;

		imageElement.style.transform = 'rotate(' + degree + 'deg)';
	}

	async function submitCaptcha()
	{
		submitElement.disabled = true;

		const json = await moFetchApiJson(
			'captcha/answerQuestion',
			{
				body: JSON.stringify(
				{
					degree: imageElement.dataset.degree,
				}),
			});

		if (json.resultCode == moApiResultCode.captchaWrong)
		{
			loadingElement.style.visibility = 'visible';

			const result = await fetchCaptcha();

			if (result == 1) return;

			wrongMessageElement.style.visibility = 'visible';

			submitElement.disabled = false;
		}
		else if (json.resultCode == moApiResultCode.success)
		{
			holder.remove();
		}
		else
		{
			throw new Error(json);
		}
	}

	async function fetchCaptcha()
	{
		const response = await moFetchApi('captcha/createQuestion');

		var resultCode = response.headers.get(moHttpHeaderName.resultCode);

		if (resultCode == null) throw new Error(response.headers);

		if (resultCode == moApiHeaderResultCode.captchaPassed)
		{
			holder.remove();
			
			return 1;
		}

		if (resultCode != moApiHeaderResultCode.success) throw new Error('Mo-Captcha-Result-Code: ' + resultCode);


		const blob = await response.blob();

		const objectURL = URL.createObjectURL(blob);

		imageElement.src = objectURL;

		imageElement.dataset.degree = 0;
		
		imageElement.style.transform = 'rotate(0deg)';


		loadingElement.style.visibility = 'hidden';
	}
}