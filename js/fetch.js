async function moFetch(url, options)
{
	try
	{
		const response = await fetch(url, options);

		if (!response.ok) throw new Error(response);
		
		return response;
	}
	catch(error)
	{
		console.log(object);
	}
}

async function moFetchApi(url, options)
{
	options.method = 'POST';
	
	return await moFetch(globalThis.moApiUriPrefix + url, options);
}

async function moFetchText(url, options)
{
	const response = await moFetch(url, options);
	
	if (response == null) return;
	
	
	try
	{
		return await response.text();
	}
	catch(error)
	{
		console.log(error);
	}
}
