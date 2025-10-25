(async function ()
{
	const fetchPremise = import('/js/fetch.js');

	var navigationLandscapeLayout;
	var navigationPortraitLayout;

	var isNavigationLandscapeLayoutLoaded = false;
	var isNavigationPortraitLayoutLoaded = false;

	var isLoggedIn = false;

	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
	else
		onDOMContentLoaded();

	screen.orientation.addEventListener("change", loadNavigation);

	async function onDOMContentLoaded()
	{
		await fetchPremise;

		navigationLandscapeLayout = getElementById('navigationLandscapeLayout');
		navigationPortraitLayout = getElementById('navigationPortraitLayout');

		isLoggedIn = mo.getIsLoggedIn();

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
			const navLogout = getElementById(selector);

			navLogout.addEventListener('click', function ()
			{
				mo.fetchApiJson('user/logout');

				mo.removeIsLoggedIn();

				location.href = '/';
			});
		}

		function removeLoggedInClass(element)
		{
			if (isLoggedIn)
			{
				element.querySelectorAll('.loggedIn').forEach(function (element2)
				{
					element2.classList.remove('loggedIn');
				});
			}
		}
	}

	function getElementById(id)
	{
		return document.getElementById(id);
	}
})();
