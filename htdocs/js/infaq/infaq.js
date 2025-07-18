(function ()
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const dateTimeElement = getElementById('dateTime');
        const munfiqNameElement = getElementById('munfiqName');
        const paymentElement = getElementById('payment');
        const amountElement = getElementById('amount');
        const statusElement = getElementById('status');

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
        munfiqNameElement.innerHTML = json.munfiqName;
        paymentElement.innerHTML = json.paymentType;
        amountElement.innerHTML = json.amount;
        statusElement.innerHTML = json.status;

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
