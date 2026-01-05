(() =>
{
	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", layout);
	else
		layout();

	screen.orientation.addEventListener("change", layout);

	function layout()
	{
		const headerElement = mo.getElementById('headerLayout');
		const flexLayoutElement = mo.getElementById('flexLayout');
		const footerElement = mo.getElementById('footerLayout');

		const flexLayoutStyle = flexLayoutElement.getAttribute('style');

		const flextLayoutHeight = document.documentElement.clientHeight - headerElement.offsetHeight - footerElement.offsetHeight - 1;

		flexLayoutElement.setAttribute('style', flexLayoutStyle + `; min-height: ${flextLayoutHeight}px`);
	}

})();
