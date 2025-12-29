(async () =>
{
    import('/js/loading.js');

    await import('/js/envConfig.js');
    await import('/js/storage.js');
    await import('/js/authorization.js');

    mo.authorizeAnonymous();

    await import('/js/common.js');
    await import('/js/fetch.js');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const formElement = mo.getElementById('registerForm');
        const emailElement = mo.getElementById('emailInput');
        const messageElement = mo.getElementById('messageElement');
        const submitElement = mo.getElementById('submitButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!formElement.reportValidity()) return;


            const email = emailElement.value;

            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            try
            {
                const json = await mo.fetchSetPassword({
                    Contact: email,
                    ContactType: 1,
                });

                if (json.ResultCode) return showError(json.ResultMessage);


                mo.setLoggedIn();

                const data = json.Data;

                mo.setPermission(data.Permission);
                mo.setUserType(data.UserType);

                if (data.ApplicationCulture) mo.setApplicationCulture(data.ApplicationCulture);

                messageElement.textContent = 'Success, redirecting...';
                messageElement.classList.toggle("loading");

                location.href = '/';
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
