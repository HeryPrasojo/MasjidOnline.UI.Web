onDOMContentLoaded(async function()
{
	var result = await moTryAsync(moCreateCaptchaQuestion, captchaCatchCallback);

	if (result == 1) return;
	
	function captchaCatchCallback(error)
	{
		console.log(error);

		const captchaHolder = moGetElement('captchaHolder');

		captchaHolder.innerHTML = '!';
	}
});
