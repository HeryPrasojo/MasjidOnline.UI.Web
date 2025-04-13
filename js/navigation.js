(function ()
{
	var navigationLandscapeLayout;
	var navigationPortraitLayout;

	mo.onDOMContentLoaded(onDOMContentLoaded);

	screen.orientation.addEventListener("change", loadNavigation);

	async function onDOMContentLoaded()
	{
		navigationLandscapeLayout = mo.getElement('navigationLandscapeLayout');
		navigationPortraitLayout = mo.getElement('navigationPortraitLayout');

		await loadNavigation();
	}

	async function loadNavigation()
	{
		const isPortrait = window.matchMedia("(orientation: portrait)").matches;

		try
		{
			if (isPortrait)
			{
			}
			else
			{
				const text = await mo.fetchText('/html/navigationLandscape.html');

				navigationLandscapeLayout.innerHTML = text;

				navigationPortraitLayout.remove();
			}
		}
		catch (error)
		{
			const errorString = error.toString();

			console.error(errorString);

			if (isPortrait)
			{
			}
			else
			{
				navigationLandscapeLayout.innerHTML = errorString;
			}
		}
	}
})();
