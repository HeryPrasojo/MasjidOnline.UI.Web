async function moCreateCaptchaQuestion()
{
	const isUserSessionExists = moCheckUserSessionExists();
	
	if (isUserSessionExists) return 1;


	const response = await moFetchApi('captcha/createQuestion', options);
	
	var resultCode = response.headers.get('Mo-Captcha-Result-Code');
	
	if (resultCode == null) throw new Error(response.headers);

	if (resultCode == '11') return 1;

	if (resultCode != '0') throw new Error('Mo-Captcha-Result-Code: ' + resultCode);

	const blob = await response.blob();


	const holder = getElement('captchaHolder');

	const text = await moFetchText('/html/captcha.html');
	
	-;
	if (text == null)
	{
		holder.innerHTML = '!';
		
		return;
	}
	
	holder.innerHTML = text;
	
	
	const objectURL = URL.createObjectURL(blob);
	
	image.src = objectURL;

}