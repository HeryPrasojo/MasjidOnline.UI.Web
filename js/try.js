function moTry(tryCallback, catchCallback)
{
	try
	{
		return tryCallback();
	}
	catch(error)
	{
		catchCallback(error);
	}
}

async function moTryAsync(tryCallback, catchCallback)
{
	try
	{
		return await tryCallback();
	}
	catch(error)
	{
		catchCallback(error);
	}
}
