(async () =>
{
    const signalRPromise = import('//cdn.jsdelivr.net/npm/@microsoft/signalr@9.0.6/dist/browser/signalr.min.js');

    await import('/js/envConfig.js');
    await import('/js/common.js');
    await import('/js/storage.js');
    await import('/js/authorization.js');

    mo.authorizeInternal();

    await signalRPromise;

    import('/js/hub.js');

    await import('/js/fetch.js');

    import('/js/navigation.js');
    import('/js/loading.js');


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const internalUserAddButton = mo.getElementById('internalUserAddButton');

        const internalUserRowHolder = mo.getElementById('internalUserRowHolder');
        const internalUserPageCurrent = mo.getElementById('internalUserPageCurrent');
        const internalUserPageTotal = mo.getElementById('internalUserPageTotal');
        const internalUserErrorMessage = mo.getElementById('internalUserErrorMessage');
        const internalUserFirstButton = mo.getElementById('internalUserFirstButton');
        const internalUserPrevButton = mo.getElementById('internalUserPrevButton');
        const internalUserPageInput = mo.getElementById('internalUserPageInput');
        const internalUserGoButton = mo.getElementById('internalUserGoButton');
        const internalUserNextButton = mo.getElementById('internalUserNextButton');
        const internalUserLastButton = mo.getElementById('internalUserLastButton');


        if (mo.authorizePermission({ UserInternalAdd: 1 }))
        {
            internalUserAddButton.classList.remove('display-none');
        }


        var currentPage = 1;
        var totalPage = 0;

        internalUserAddButton.addEventListener('click', () => location.href = '/user/internal/add');

        internalUserFirstButton.addEventListener('click', submitFirst);
        internalUserPrevButton.addEventListener('click', submitPrev);
        internalUserGoButton.addEventListener('click', submitNumber);
        internalUserNextButton.addEventListener('click', submitNext);
        internalUserLastButton.addEventListener('click', submitLast);


        var isFirstPageLoaded = false;

        if (mo.isHubStarted) await submitFirst();

        else document.addEventListener('hubStarted', async () =>
        {
            if (!isFirstPageLoaded)
            {
                isFirstPageLoaded = true;

                await submitFirst();
            }
        });


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
            const pageNumber = parseInt(internalUserPageInput.value, 10);

            if (isNaN(pageNumber) || pageNumber < 1)
            {
                const text = 'Invalid page number. Page number must be a positive integer.';

                internalUserErrorMessage.innerHTML = text;

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
                internalUserErrorMessage.innerHTML = 'Invalid page number. Page number must be a positive integer.';

                return;
            }

            internalUserRowHolder.innerHTML = '';
            internalUserErrorMessage.innerHTML = '';

            internalUserFirstButton.disabled = true;
            internalUserPrevButton.disabled = true;
            internalUserGoButton.disabled = true;
            internalUserNextButton.disabled = true;
            internalUserLastButton.disabled = true;

            var json = await mo.receiveUserList({
                Page: pageNumber,
            });

            const data = json.Data;
            currentPage = pageNumber;
            totalPage = data.PageCount;


            for (const record of data.Records)
            {
                const idTextNode = document.createTextNode(record.Id);
                const dateTimeTextNode = record.DateTime;
                const name = record.PersonName;
                const statusTextNode = record.Status;
                const addName = record.AddPersonName ?? '';

                const itemA = document.createElement('a');
                itemA.href = 'internal?id=' + record.Id;
                itemA.append(idTextNode);

                const idTd = document.createElement('td');
                const dateTimeTd = document.createElement('td');
                const nameTd = document.createElement('td');
                const statusTd = document.createElement('td');
                const addNameTd = document.createElement('td');

                idTd.append(itemA);
                dateTimeTd.append(document.createTextNode(dateTimeTextNode));
                nameTd.append(document.createTextNode(name));
                statusTd.append(document.createTextNode(statusTextNode));
                addNameTd.append(document.createTextNode(addName));

                const tr = document.createElement('tr');

                tr.append(idTd, dateTimeTd, nameTd, statusTd, addNameTd);

                internalUserRowHolder.append(tr);
            }


            internalUserPageCurrent.innerText = currentPage;
            internalUserPageTotal.innerText = totalPage;

            if (currentPage > 1)
            {
                internalUserFirstButton.disabled = false;
                internalUserPrevButton.disabled = false;
            }

            internalUserPageInput.value = currentPage;
            internalUserGoButton.disabled = false;

            if (currentPage < totalPage)
            {
                internalUserNextButton.disabled = false;
                internalUserLastButton.disabled = false;
            }
        }
    }

})();
