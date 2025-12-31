(async () =>
{
    const signalRPromise = import('//cdn.jsdelivr.net/npm/@microsoft/signalr@9.0.6/dist/browser/signalr.min.js');

    await import('/js/envConfig.js');
    await import('/js/common.js');
    await import('/js/storage.js');
    await import('/js/authorization.js');

    mo.authorizePermission({ UserInternalAdd: 1 }, true);

    await import('/js/fetch.js');
    await signalRPromise;

    import('/js/hub.js');
    import('/js/navigation.js');
    import('/js/loading.js');


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const formElement = mo.getElementById('addForm');
        const contactElement = mo.getElementById('contactInput');
        const messageElement = mo.getElementById('addMessage');
        const submitElement = mo.getElementById('addButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!formElement.reportValidity()) return;


            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            try
            {
                const json = await mo.sendUserInternalAdd({ Contact: contactElement.value });

                if (json.ResultCode) return showError(json.ResultMessage);


                messageElement.textContent = 'Success, redirecting...';
                messageElement.classList.toggle("loading");

                submitElement.classList.toggle("loading");

                location.href = '/user/internal/list';
            }
            catch (err)
            {
                console.error(err);

                showError(err.message);
            }

            function showError(e)
            {
                submitElement.classList.toggle("loading");
                submitElement.disabled = false;

                messageElement.textContent = e;
                messageElement.style.color = 'red';
            }
        }
    }
})();
