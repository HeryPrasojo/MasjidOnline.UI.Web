(function ()
{
    window.addEventListener('load', onLoaded);

    function onLoaded()
    {
        const pageLoading = document.getElementById('pageLoading');

        pageLoading.remove();

        console.log((new Date()).toISOString() + ' loading window loaded');
    }

    console.log((new Date()).toISOString() + ' loading loaded');
})();
