(function ()
{
	var navigationLandscapeLayout;
	var navigationPortraitLayout;

	var isNavigationLandscapeLayoutLoaded = false;
	var isNavigationPortraitLayoutLoaded = false;

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
				const text = await mo.fetchText('/html/navigationPortrait.html');

				navigationPortraitLayout.innerHTML = text;

				navigationLandscapeLayout.classList.add("display-none");
				navigationPortraitLayout.classList.remove("display-none");
			}
			else
			{
				const text = await mo.fetchText('/html/navigationLandscape.html');

				navigationLandscapeLayout.innerHTML = text;

				navigationPortraitLayout.classList.add("display-none");
				navigationLandscapeLayout.classList.remove("display-none");
			}
		}
		catch (error)
		{
			const errorString = error.toString();

			console.error(errorString);

			if (isPortrait)
			{
				navigationPortraitLayout.innerHTML = errorString;
			}
			else
			{
				navigationLandscapeLayout.innerHTML = errorString;
			}
		}
	}
})();
