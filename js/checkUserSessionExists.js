function moCheckUserSessionExists()
{
	const cookieExists = moCheckCookieExists('SessId');
	
	if (!cookieExists) return false;
	
	const isLogin = localStorage.getItem('isLogin');
	
	if (isLogin == null) return false;
	
	return true;
}
