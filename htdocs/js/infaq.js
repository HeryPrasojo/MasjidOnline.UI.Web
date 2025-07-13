(function ()
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');

        var json = await mo.fetchApiJson(
            'infaq/infaq/getOne',
            {
                body:
                {
                    id: id,
                },
            });

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
