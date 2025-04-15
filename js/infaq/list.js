mo.onDOMContentLoaded(function ()
{
    const infaqRowHolder = mo.getElement('infaqRowHolder');
    const infaqPageCurrent = mo.getElement('infaqPageCurrent');
    const infaqPageTotal = mo.getElement('infaqPageTotal');
    const infaqErrorMessage = mo.getElement('infaqErrorMessage');
    // const formInfaqPage = mo.getElement('formInfaqPage');
    const infaqFirstButton = mo.getElement('infaqFirstButton');
    const infaqPrevButton = mo.getElement('infaqPrevButton');
    const infaqPageInput = mo.getElement('infaqPageInput');
    const infaqGoButton = mo.getElement('infaqGoButton');
    const infaqNextButton = mo.getElement('infaqNextButton');
    const infaqLastButton = mo.getElement('infaqLastButton');

    var currentPage = 1;
    var totalPage = 0;

    infaqFirstButton.addEventListener('click', submitFirst);
    infaqPrevButton.addEventListener('click', submitPrev);
    infaqGoButton.addEventListener('click', submitNumber);
    infaqNextButton.addEventListener('click', submitNext);
    infaqLastButton.addEventListener('click', submitLast);

    submitForm();

    async function submitFirst()
    {
        await submitForm(1);
    }

    async function submitPrev()
    {
        await submitForm(currentPage - 1);
    }

    async function submitNumber()
    {
        const pageNumber = parseInt(infaqPageInput.value, 10);

        if (isNaN(pageNumber) || pageNumber < 1)
        {
            const text = 'Invalid page number. Page number must be a positive integer.';

            infaqErrorMessage.innerHTML = text;

            throw Error(text);
        }

        await submitForm(pageNumber);
    }

    async function submitNext()
    {
        await submitForm(currentPage + 1);
    }

    async function submitLast()
    {
        await submitForm(totalPage);
    }

    async function submitForm(pageNumber)
    {
        if (isNaN(pageNumber) || pageNumber < 1)
        {
            infaqErrorMessage.innerHTML = 'Invalid page number. Page number must be a positive integer.';

            return;
        }

        infaqRowHolder.innerHTML = '';
        infaqErrorMessage.innerHTML = '';

        infaqFirstButton.disabled = true;
        infaqPrevButton.disabled = true;
        infaqGoButton.disabled = true;
        infaqNextButton.disabled = true;
        infaqLastButton.disabled = true;

        var json = await mo.fetchApiJson(
            'infaq/infaq/getMany',
            {
                body:
                {
                    page: pageNumber,
                },
            });


        currentPage = pageNumber;
        totalPage = json.total;


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


        infaqPageCurrent.innerText = currentPage;
        infaqPageTotal.innerText = totalPage;

        if (currentPage > 1)
        {
            infaqFirstButton.disabled = false;
            infaqPrevButton.disabled = false;
        }

        infaqPageInput.value = currentPage;
        infaqGoButton.disabled = false;

        if (currentPage < json.total)
        {
            infaqNextButton.disabled = false;
            infaqLastButton.disabled = false;
        }
    }

    console.log((new Date()).toISOString() + ' load list');
});