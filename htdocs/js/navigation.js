(() =>
{
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
		navigationLandscapeLayout = mo.getElementById('navigationLandscapeLayout');
		navigationPortraitLayout = mo.getElementById('navigationPortraitLayout');

		await loadNavigation();
	}

	async function loadNavigation(event)
	{
		var isPortrait;

		if (event)
		{
			isPortrait = 'portrait-primary' === event.target.type || 'portrait-secondary' === event.target.type;
		}
		else
		{
			isPortrait = window.matchMedia("(orientation: portrait)").matches;
		}

		if (isPortrait)
		{
			if (!isNavigationPortraitLayoutLoaded)
			{
				const text = await mo.fetchText('/html/navigationPortrait.html');

				navigationPortraitLayout.innerHTML = text;

				removeLoggedInClass(navigationPortraitLayout);

				addLogoutListener('navPortraitLogout');

				const navigationPortraitTheRestButton = mo.getElementById('navigationPortraitTheRestButton');
				const navigationPortraitTheRest = mo.getElementById('navigationPortraitTheRest');
				const navigationPortraitTheRestSubItemParentInfaqButton = mo.getElementById('navigationPortraitTheRestSubItemParentInfaqButton');

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
				const text = await mo.fetchText('/html/navigationLandscape.html');

				navigationLandscapeLayout.innerHTML = text;

				removeLoggedInClass(navigationLandscapeLayout);

				addLogoutListener('navLandscapeLogout');

				isNavigationLandscapeLayoutLoaded = true;
			}

			navigationPortraitLayout.classList.add("display-none");
			navigationLandscapeLayout.classList.remove("display-none");
		}

		function addLogoutListener(selector)
		{
			const navLogout = mo.getElementById(selector);

			navLogout.addEventListener('click', () =>
			{
				mo.sendLogout();
			});
		}

		// TODO move to authorization.js
		function removeLoggedInClass(element)
		{
			const isLoggedIn = mo.getIsLoggedIn();

			if (isLoggedIn)
			{
				element.querySelectorAll('.loggedIn').forEach((element2) =>
				{
					element2.classList.remove('loggedIn');
				});


				const userType = mo.getUserType();

				// internal
				if (userType == 5)
				{
					element.querySelectorAll('.internal').forEach((element2) =>
					{
						element2.classList.remove('internal');
					});
				}
			}
			else
			{
				element.querySelectorAll('.anonymous').forEach(function (element2)
				{
					element2.classList.remove('anonymous');
				});
			}
		}
	}

})();
