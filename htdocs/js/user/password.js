(function ()
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const dateTimeElement = getElementById('dateTime');

        const urlSearchParams = new URLSearchParams(window.location.search);
        const idString = urlSearchParams.get('id');
        const id = parseInt(idString, 10);

        var json = await mo.fetchApiJson(
            'infaq/infaq/getOne',
            {
                body:
                {
                    id: id,
                },
            });

        dateTimeElement.innerHTML = json.dateTime;

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
