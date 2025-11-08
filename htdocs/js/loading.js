(() =>
{
    if (document.readyState === "complete")
        onLoaded();
    else
        window.addEventListener('load', onLoaded);

    function onLoaded()
    {
        const pageLoading = document.getElementById('pageLoading');

        pageLoading.remove();
    }
})();
