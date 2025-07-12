const moCaptchaPassedStorageKey = 'isCaptchaPassed';

mo.isCaptchaNeeded = async function ()
{
	const sessionId = await mo.isSessionExists();

	if (!sessionId)
		return true;


	const isLogin = localStorage.getItem('isLogin');

	if (isLogin != null)
		return false;


	const isCaptchaPassed = localStorage.getItem(moCaptchaPassedStorageKey);

	if (isCaptchaPassed != null)
		return false;

	return true;
}
mo.setCaptchaPassed = function ()
{
	localStorage.setItem(moCaptchaPassedStorageKey, true);
}