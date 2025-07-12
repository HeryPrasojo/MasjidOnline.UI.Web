(function ()
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        console.log((new Date()).toISOString() + ' about DOM content loaded');
    }

    console.log((new Date()).toISOString() + ' about loaded');
})();
