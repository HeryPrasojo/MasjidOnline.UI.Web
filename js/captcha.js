async function moCreateCaptchaQuestion()
{
	const isUserSessionExists = moCheckUserSessionExists();

	if (isUserSessionExists) return 1;


	const response = await moFetchApi('captcha/createQuestion');

	var resultCode = response.headers.get(moHttpHeaderName.resultCode);

	if (resultCode == null) throw new Error(response.headers);

	if (resultCode == moApiResultCode.captchaPassed) return 1;

	if (resultCode != moApiResultCode.success) throw new Error('Mo-Captcha-Result-Code: ' + resultCode);

	const blob = await response.blob();


	const holder = moGetElement('captchaHolder');

	const text = await moFetchText('/html/captcha.html');

	holder.innerHTML = text;


	const imageElement = moGetElement('captchaImage');

	const objectURL = URL.createObjectURL(blob);

	imageElement.src = objectURL;

	imageElement.dataset.degree = 0;


	const decreaseDegreeElement = moGetElement('captchaDecreaseDegree');

	decreaseDegreeElement.addEventListener('click', decreaseDegree);


	const increaseDegreeElement = moGetElement('captchaIncreaseDegree');

	increaseDegreeElement.addEventListener('click', increaseDegree);


	const submitElement = moGetElement('captchaSubmit');

	submitElement.addEventListener('click', submitCaptcha);

	return 0;


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

	// todo disable submit element
	async function submitCaptcha()
	{
		const response = await moFetchApi(
			'captcha/answerQuestion',
			{
				body: JSON.stringify(
				{
					degree: imageElement.dataset.degree,
				}),
			});
	}
}