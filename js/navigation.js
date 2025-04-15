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
				if (!isNavigationPortraitLayoutLoaded)
				{
					const text = await mo.fetchText('/html/navigationPortrait.html');

					navigationPortraitLayout.innerHTML = text;

					isNavigationPortraitLayoutLoaded = true;
				}

				navigationLandscapeLayout.classList.add("display-none");
				navigationPortraitLayout.classList.remove("display-none");
			}
			else
			{
				if (!isNavigationLandscapeLayoutLoaded)
				{
					const text = await mo.fetchText('/html/navigationLandscape.html');

					navigationLandscapeLayout.innerHTML = text;

					isNavigationLandscapeLayoutLoaded = true;
				}

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
