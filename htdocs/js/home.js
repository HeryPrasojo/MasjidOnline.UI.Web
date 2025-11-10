(async () =>
{
    const signalRPromise = import('https://cdn.jsdelivr.net/npm/@microsoft/signalr@9.0.6/dist/browser/signalr.min.js');

    import('/js/loading.js');

    await import('/js/envConfig.js');

    await import('/js/storage.js');

    await signalRPromise;

    import('/js/hub.js');

    await import('/js/fetch.js');

    import('/js/navigation.js');


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
    }
})();
