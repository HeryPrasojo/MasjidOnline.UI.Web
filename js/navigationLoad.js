async function loadNavigation()
{
	const response = await fetch('/html/navigation.html');
	
	const text = await response.text();
	
	const nav = getElement('navigation');
	
	nav.innerHTML = text;
}

onDOMContentLoaded(loadNavigation);
