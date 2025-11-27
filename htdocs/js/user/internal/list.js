(async () =>
{
    const signalRPromise = import('//cdn.jsdelivr.net/npm/@microsoft/signalr@9.0.6/dist/browser/signalr.min.js');

    import('/js/loading.js');

    await import('/js/envConfig.js');

    await import('/js/storage.js');

    await import('/js/authorization.js');

    mo.authorizeUser();

    await signalRPromise;

    import('/js/hub.js');

    await import('/js/fetch.js');

    import('/js/navigation.js');


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const internalUserAddButton = getElementById('internalUserAddButton');

        const internalUserRowHolder = getElementById('internalUserRowHolder');
        const internalUserPageCurrent = getElementById('internalUserPageCurrent');
        const internalUserPageTotal = getElementById('internalUserPageTotal');
        const internalUserErrorMessage = getElementById('internalUserErrorMessage');
        // const forminternalUserPage = getElementById('forminternalUserPage');
        const internalUserFirstButton = getElementById('internalUserFirstButton');
        const internalUserPrevButton = getElementById('internalUserPrevButton');
        const internalUserPageInput = getElementById('internalUserPageInput');
        const internalUserGoButton = getElementById('internalUserGoButton');
        const internalUserNextButton = getElementById('internalUserNextButton');
        const internalUserLastButton = getElementById('internalUserLastButton');


        const permission = mo.getPermission();

        if (permission.UserInternalAdd)
        {
            internalUserAddButton.classList.remove('display-none');
        }


        internalUserAddButton.addEventListener('click', showInternalUserAddDialog);


        var currentPage = 1;
        var totalPage = 0;

        internalUserFirstButton.addEventListener('click', submitFirst);
        internalUserPrevButton.addEventListener('click', submitPrev);
        internalUserGoButton.addEventListener('click', submitNumber);
        internalUserNextButton.addEventListener('click', submitNext);
        internalUserLastButton.addEventListener('click', submitLast);

        const internalUserAddDialog = getElementById('internalUserAddDialog');

        var internalUserAddAddButton;

        mo.onHubStarted = async () =>
        {
            await submitFirst();
        }

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
                page: pageNumber,
            });
            console.log(json);

            const data = json.Data;
            currentPage = pageNumber;
            totalPage = data.PageCount;


            for (const record of data.Records)
            {
                const idTextNode = document.createTextNode(record.Id);
                const dateTimeTextNode = record.DateTime;
                const munfiqName = record.MunfiqName;
                const paymentType = record.PaymentType;
                const amountTextNode = record.Amount;
                const paymentStatusTextNode = record.PaymentStatus;

                const itemA = document.createElement('a');
                itemA.href = 'internal?id=' + record.Id;
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

        async function showInternalUserAddDialog()
        {
            internalUserAddButton.disabled = true;
            internalUserAddButton.classList.toggle("loading");

            const internalUserAddAddId = 'internalUserAddAddButton';
            internalUserAddAddButton = getElementById(internalUserAddAddId);

            if (!internalUserAddAddButton)
            {
                const text = await mo.fetchText('/html/user/internal/add.html');

                internalUserAddDialog.innerHTML = text;


                internalUserAddAddButton = getElementById(internalUserAddAddId);

                internalUserAddAddButton.addEventListener('click', addInternalUser);

                function addInternalUser()
                {

                }
            }

            internalUserAddDialog.showModal();

        }
    }

    function getElementById(id)
    {
        return document.getElementById(id);
    }
})();
