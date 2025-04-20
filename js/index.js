(function ()
{
    console.log((new Date()).toISOString() + ' index start');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        console.log((new Date()).toISOString() + ' index DOM content start');

        console.log((new Date()).toISOString() + ' index DOM content finish');
    }

    console.log((new Date()).toISOString() + ' index finish');
})();
