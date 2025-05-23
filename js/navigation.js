(function ()
{
	console.log((new Date()).toISOString() + ' navigation start');

	var navigationLandscapeLayout;
	var navigationPortraitLayout;

	var isNavigationLandscapeLayoutLoaded = false;
	var isNavigationPortraitLayoutLoaded = false;

	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
	else
		onDOMContentLoaded();

	screen.orientation.addEventListener("change", loadNavigation);

	async function onDOMContentLoaded()
	{
		console.log((new Date()).toISOString() + ' navigation DOM content start');

		navigationLandscapeLayout = getElementById('navigationLandscapeLayout');
		navigationPortraitLayout = getElementById('navigationPortraitLayout');

		await loadNavigation();

		console.log((new Date()).toISOString() + ' navigation DOM content finish');
	}

	async function loadNavigation(event)
	{
		console.log((new Date()).toISOString() + ' navigation navigation start');

		var isPortrait;

		if (event)
		{
			isPortrait = 'portrait-primary' === event.target.type || 'portrait-secondary' === event.target.type;
		}
		else
		{
			isPortrait = window.matchMedia("(orientation: portrait)").matches;
		}

		try
		{
			if (isPortrait)
			{
				if (!isNavigationPortraitLayoutLoaded)
				{
					const text = await fetchText('/html/navigationPortrait.html');

					navigationPortraitLayout.innerHTML = text;

					const navigationPortraitTheRestButton = getElementById('navigationPortraitTheRestButton');
					const navigationPortraitTheRest = getElementById('navigationPortraitTheRest');
					const navigationPortraitTheRestSubItemParentInfaqButton = getElementById('navigationPortraitTheRestSubItemParentInfaqButton');

					navigationPortraitTheRestButton.addEventListener("click", onClick);

					window.addEventListener('click', onWindowClick);

					function onClick()
					{
						navigationPortraitTheRest.classList.toggle("display-none");
					}

					function onWindowClick(event)
					{
						if ((event.target != navigationPortraitTheRestButton) && (event.target != navigationPortraitTheRestSubItemParentInfaqButton))
						{
							navigationPortraitTheRest.classList.add("display-none");
						}
					}

					isNavigationPortraitLayoutLoaded = true;
				}

				navigationLandscapeLayout.classList.add("display-none");
				navigationPortraitLayout.classList.remove("display-none");
			}
			else
			{
				if (!isNavigationLandscapeLayoutLoaded)
				{
					const text = await fetchText('/html/navigationLandscape.html');

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

		async function fetchText(url)
		{
			const response = await fetch(url);

			if (!response.ok) throw Error(response.status + ' ' + response.statusText);

			return response.text();
		}

		console.log((new Date()).toISOString() + ' navigation navigation finish');
	}

	function getElementById(id)
	{
		return document.getElementById(id);
	}

	console.log((new Date()).toISOString() + ' navigation finish');
})();
