(async () =>
{
    await Promise.all([
        import('//cdn.jsdelivr.net/npm/@microsoft/signalr@9.0.6/dist/browser/signalr.min.js'),
        import('/js/envConfig.js'),
    ]);

    await Promise.all([
        import('/js/common.js'),
        import('/js/storage.js'),
    ]);

    import('/js/layout.js')
    import('/js/loading.js');
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
