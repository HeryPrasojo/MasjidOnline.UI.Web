mo.onDOMContentLoaded(async function ()
{
	const holder = mo.getElement('navHolder');

	const text = await mo.fetchText('/html/navigation.html');

	if (text == null)
		return mo.showError('!');

	holder.innerHTML = text;
});
