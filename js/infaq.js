async function load()
{
	const isUserSessionExists = checkUserSessionExists();
	if (!isUserSessionExists)
	{
		await moFetchApi(url, options);
	
		if (response == null) return;
	
	
		try
		{
			const blob = await response.blob();
		}
		catch(error)
		{
			console.log(error);
		}
		
		const objectURL = URL.createObjectURL(blob);
		
		image.src = objectURL;
	}
}

onDOMContentLoaded(load);
