(function ()
{
    console.log((new Date()).toISOString() + ' list start');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        console.log((new Date()).toISOString() + ' list DOM content start');

        const infaqRowHolder = getElementById('infaqRowHolder');
        const infaqPageCurrent = getElementById('infaqPageCurrent');
        const infaqPageTotal = getElementById('infaqPageTotal');
        const infaqErrorMessage = getElementById('infaqErrorMessage');
        // const formInfaqPage = getElementById('formInfaqPage');
        const infaqFirstButton = getElementById('infaqFirstButton');
        const infaqPrevButton = getElementById('infaqPrevButton');
        const infaqPageInput = getElementById('infaqPageInput');
        const infaqGoButton = getElementById('infaqGoButton');
        const infaqNextButton = getElementById('infaqNextButton');
        const infaqLastButton = getElementById('infaqLastButton');

        var currentPage = 1;
        var totalPage = 0;

        infaqFirstButton.addEventListener('click', submitFirst);
        infaqPrevButton.addEventListener('click', submitPrev);
        infaqGoButton.addEventListener('click', submitNumber);
        infaqNextButton.addEventListener('click', submitNext);
        infaqLastButton.addEventListener('click', submitLast);

        await submitFirst();

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
            totalPage = json.pageCount;


            for (const record of json.records)
            {
                const tr = document.createElement('tr');

                const idTd = document.createElement('td');
                const dateTimeTd = document.createElement('td');
                const munfiqNameTd = document.createElement('td');
                const paymentTypeTd = document.createElement('td');
                const amountTd = document.createElement('td');
                const paymentStatusTd = document.createElement('td');

                amountTd.className = 'textAlign-end';

                idTd.append(document.createTextNode(record.id));
                dateTimeTd.append(document.createTextNode(record.dateTime));
                munfiqNameTd.append(document.createTextNode(record.munfiqName));
                paymentTypeTd.append(document.createTextNode(record.paymentType));
                amountTd.append(document.createTextNode(record.amount));
                paymentStatusTd.append(document.createTextNode(record.paymentStatus));

                tr.append(idTd, dateTimeTd, munfiqNameTd, paymentTypeTd, amountTd, paymentStatusTd);

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

            if (currentPage < json.pageCount)
            {
                infaqNextButton.disabled = false;
                infaqLastButton.disabled = false;
            }
        }

        console.log((new Date()).toISOString() + ' list DOM content finish');
    }

    function getElementById(id)
    {
        return document.getElementById(id);
    }

    console.log((new Date()).toISOString() + ' list finish');
})();
