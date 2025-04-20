(function ()
{
    console.log((new Date()).toISOString() + ' loading start');

    window.addEventListener('load', onLoaded);

    function onLoaded()
    {
        console.log((new Date()).toISOString() + ' loading window start');

        const pageLoading = document.getElementById('pageLoading');

        pageLoading.remove();

        console.log((new Date()).toISOString() + ' loading window finish');
    }

    console.log((new Date()).toISOString() + ' loading finish');
})();
