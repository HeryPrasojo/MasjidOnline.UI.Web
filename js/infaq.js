onDOMContentLoaded(async function()
{
	var result = await moTryAsync(moCreateCaptchaQuestion, captchaCatchCallback);

	if (result == 1) return;
	
	function captchaCatchCallback(error)
	{
		console.error(error);

		const captchaHolder = getElement('captchaHolder');

		captchaHolder.innerHTML = '!';
	}
});
