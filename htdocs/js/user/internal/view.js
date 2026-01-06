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

    await Promise.all([
        import('/js/authorization.js'),
        import('/js/fetch.js'),
        import('/js/hub.js'),
    ]);

    import('/js/navigation.js');


    const urlSearchParams = new URLSearchParams(window.location.search);

    const idParam = urlSearchParams.get('i');

    if (!idParam) location.href = '/';

    const internalUserId = parseInt(idParam);


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        moAuthorization.showInternal();


        const internalUserMessage = mo.getElementById('internalUserMessage');
        const internalUserIdElement = mo.getElementById('internalUserIdField');
        const dateTimeElement = mo.getElementById('dateTimeField');
        const contactElement = mo.getElementById('contactField');
        const descriptionElement = mo.getElementById('descriptionField');
        const nameElement = mo.getElementById('nameField');
        const statusElement = mo.getElementById('statusField');
        const addNameElement = mo.getElementById('addNameField');
        const editNameElement = mo.getElementById('editNameField');
        const editDateTimeElement = mo.getElementById('editDateTimeField');
        const buttonRowElement = mo.getElementById('buttonRow');

        internalUserIdElement.textContent = internalUserId;


        if (!mo.getIsLoggedIn() || mo.isHubStarted) receiveUserInternalView();

        else document.addEventListener('hubStarted', receiveUserInternalView);


        async function receiveUserInternalView()
        {
            const body = {
                Id: internalUserId,
            };

            const json = mo.getIsLoggedIn()
                ? await mo.receiveUserInternalView(body)
                : await mo.fetchUserInternalView(body);

            if (json.ResultCode)
            {
                internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
                internalUserMessage.classList.toggle("loading");

                return showError(json.ResultMessage);
            }


            const data = json.Data;

            if (data.Status == 1)
            {
                moAuthorization.showInternalPermission({
                    UserInternalAdd: ['#cancelButton'],
                    UserInternalApprove: ['#descriptionRow', '#descriptionInputParent', '#approveButton', '#rejectButton'],
                });


                const p = mo.getPermission();

                if (p && (p.UserInternalAdd || p.UserInternalApprove))
                {
                    buttonRowElement.classList.remove('internalPermission');
                }
            }
            else
            {
                document.querySelectorAll('.nonNew').forEach((element) =>
                {
                    element.classList.remove('nonNew');
                });
            }


            dateTimeElement.textContent = data.DateTime;
            descriptionElement.textContent = data.Description;
            nameElement.textContent = data.PersonName;
            statusElement.textContent = data.StatusText;
            editDateTimeElement.textContent = data.EditDateTime;

            addNameElement.textContent = data.AddPersonName;
            editNameElement.textContent = data.EditPersonName ?? '';

            if (mo.getIsLoggedIn() && (mo.getUserType() == 5))
            {
                contactElement.textContent = `${data.ContactType}: ${data.Contact}`;
                addNameElement.textContent += ` (${data.AddContactType}: ${data.AddContact})`;

                if (data.EditDateTime) editNameElement.textContent += ` (${data.EditContactType}: ${data.EditContact})`;
            }


            internalUserMessage.textContent = '\u00A0\u00A0\u00A0\u00A0';
            internalUserMessage.classList.toggle("loading");


            function showError(e)
            {
                internalUserMessage.textContent = e;
                internalUserMessage.style.color = 'red';
            }
        }
    }
})();
