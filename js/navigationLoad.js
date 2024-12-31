async function loadNavigation()
{
	const nav = getElement('navigation');

	const text = await moFetchText('/html/navigation.html');
	
	if (text == null)
	{
		nav.innerHTML = '!';
		
		return;
	}
	
	nav.innerHTML = text;
}

onDOMContentLoaded(loadNavigation);
