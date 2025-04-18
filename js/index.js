(function ()
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        console.log((new Date()).toISOString() + ' index DOM content loaded');
    }

    console.log((new Date()).toISOString() + ' index loaded');
})();

