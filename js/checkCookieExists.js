function checkCookieExists(key)
{
	const startWith = key + '=';
	
	const cookies = document.cookie.split('; ');
	for (const cookie of cookies)
	{
		if (cookie.startsWith(startWith))
		{
			return true;
		}
	}
	
	return false;
}