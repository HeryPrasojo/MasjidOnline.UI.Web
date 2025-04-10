mo.onDOMContentLoaded(function ()
{
    const infaqRowHolder = mo.getElement('infaqRowHolder');
    const infaqPageCurrent = mo.getElement('infaqPageCurrent');
    const infaqPageTotal = mo.getElement('infaqPageTotal');
    const formInfaqPage = mo.getElement('formInfaqPage');
    const infaqPageInput = mo.getElement('infaqPageInput');
    const infaqGoButton = mo.getElement('infaqGoButton');

    formInfaqPage.addEventListener('submit', submitForm);

    async function submitForm(e)
    {
        e.preventDefault();

        const page = infaqPageInput.value;

        const pageNumber = parseInt(page, 10);

        if (isNaN(pageNumber) || pageNumber < 1) mo.showError('Invalid page number', 'Page number must be a positive integer.');

        infaqRowHolder.innerHTML = '';

        infaqGoButton.disabled = true;

        var json = await mo.fetchApiJson(
            'infaq/infaq/getMany',
            {
                body:
                {
                    page: pageNumber,
                },
            });

        infaqPageCurrent.innerText = pageNumber;
        infaqPageTotal.innerText = json.total;

        infaqGoButton.disabled = false;

        for (const record of json.records)
        {
            const tr = document.createElement('tr');

            tr.append(
                document.createElement('td').append(document.createTextNode(record.id)),
                document.createElement('td').append(document.createTextNode(record.dateTime)),
                document.createElement('td').append(document.createTextNode(record.munfiqName)),
                document.createElement('td').append(document.createTextNode(record.amount)),
                document.createElement('td').append(document.createTextNode(record.status)),
            );

            infaqRowHolder.append(tr);
        }
    }

    console.log((new Date()).toISOString() + ' load list');
});