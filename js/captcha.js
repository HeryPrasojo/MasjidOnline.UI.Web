async function moCreateCaptchaQuestion()
{
	const isUserSessionExists = moCheckUserSessionExists();

	if (isUserSessionExists) return 1;


	const response = await moFetchApi('captcha/createQuestion');

	var resultCode = response.headers.get('Mo-Captcha-Result-Code');

	if (resultCode == null) throw new Error(response.headers);

	if (resultCode == '11') return 1;

	if (resultCode != '0') throw new Error('Mo-Captcha-Result-Code: ' + resultCode);

	const blob = await response.blob();


	const holder = getElement('captchaHolder');

	const text = await moFetchText('/html/captcha.html');

	holder.innerHTML = text;


	const imageElement = getElement('captchaImage');

	const objectURL = URL.createObjectURL(blob);

	imageElement.src = objectURL;

	imageElement.dataset.degree = 0;


	const decreaseDegreeElement = getElement('captchaDecreaseDegree');

	decreaseDegreeElement.addEventListener('click', decreaseDegree);


	const increaseDegreeElement = getElement('captchaIncreaseDegree');

	increaseDegreeElement.addEventListener('click', increaseDegree);


	const submitElement = getElement('captchaSubmit');

	submitElement.addEventListener('click', submitCaptcha);

	return 0;


	function decreaseDegree()
	{
		var degree = imageElement.dataset.degree - 45;

		if (degree < 0) degree = 315;

		imageElement.dataset.degree = degree;

		decreaseDegreeElement.style.transform = 'rotate(' + (degree - 180) + 'deg)';
	}

	function increaseDegree()
	{
		var degree = imageElement.dataset.degree + 45;

		if (degree > 315) degree = 0;

		imageElement.dataset.degree = degree;

		decreaseDegreeElement.style.transform = 'rotate(' + (degree - 180) + 'deg)';
	}

	function submitCaptcha()
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