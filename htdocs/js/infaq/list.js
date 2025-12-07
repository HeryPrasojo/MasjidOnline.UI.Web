(() =>
{
    const fetchPremise = import('/js/fetch.js');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        await fetchPremise;

        const infaqRowHolder = mo.getElementById('infaqRowHolder');
        const infaqPageCurrent = mo.getElementById('infaqPageCurrent');
        const infaqPageTotal = mo.getElementById('infaqPageTotal');
        const infaqErrorMessage = mo.getElementById('infaqErrorMessage');
        const infaqFirstButton = mo.getElementById('infaqFirstButton');
        const infaqPrevButton = mo.getElementById('infaqPrevButton');
        const infaqPageInput = mo.getElementById('infaqPageInput');
        const infaqGoButton = mo.getElementById('infaqGoButton');
        const infaqNextButton = mo.getElementById('infaqNextButton');
        const infaqLastButton = mo.getElementById('infaqLastButton');

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

            try
            {
                var json = await mo.fetchInfaqList({
                    Page: pageNumber
                });

                if (json.ResultCode) return showError(json.ResultMessage);


                const data = json.data;
                currentPage = pageNumber;
                totalPage = data.pageCount;

                for (const record of data.records)
                {
                    const idTextNode = document.createTextNode(record.id);
                    const dateTimeTextNode = record.dateTime;
                    const munfiqName = record.munfiqName;
                    const paymentType = record.paymentType;
                    const amountTextNode = record.amount;
                    const paymentStatusTextNode = record.paymentStatus;

                    const itemA = document.createElement('a');
                    itemA.href = 'infaq?id=' + record.id;
                    itemA.append(idTextNode);

                    const idTd = document.createElement('td');
                    const dateTimeTd = document.createElement('td');
                    const munfiqNameTd = document.createElement('td');
                    const paymentTypeTd = document.createElement('td');
                    const amountTd = document.createElement('td');
                    const paymentStatusTd = document.createElement('td');

                    amountTd.className = 'textAlign-end';

                    idTd.append(itemA);
                    dateTimeTd.append(document.createTextNode(dateTimeTextNode));
                    munfiqNameTd.append(document.createTextNode(munfiqName));
                    paymentTypeTd.append(document.createTextNode(paymentType));
                    amountTd.append(document.createTextNode(amountTextNode));
                    paymentStatusTd.append(document.createTextNode(paymentStatusTextNode));

                    const tr = document.createElement('tr');

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

                if (currentPage < data.pageCount)
                {
                    infaqNextButton.disabled = false;
                    infaqLastButton.disabled = false;
                }
            }
            catch (err)
            {
                console.error(err);

                showError(err.message);
            }

            function showError(e)
            {
                infaqErrorMessage.textContent = e;
                infaqErrorMessage.style.color = 'red';
            }
        }
    }
})();
