onDOMContentLoaded(async function()
{
	const holder = moGetElement('navHolder');

	const text = await moFetchText('/html/navigation.html');
	
	if (text == null)
	{
		holder.innerHTML = '!';
		
		return;
	}
	
	holder.innerHTML = text;
});
