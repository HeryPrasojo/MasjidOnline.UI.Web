(async () =>
{
    await import('/js/envConfig.js');

    await Promise.all([
        import('/js/common.js'),
        import('/js/geolocation.js'),
        import('/js/storage.js'),
    ]);

    import('/js/loading.js');

    await Promise.all([
        import('/js/authorization.js'),
        import('/js/fetch.js'),
    ]);


    mo.authorizeAnonymous();

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const loginFormElement = mo.getElementById('loginForm');
        const emailElement = mo.getElementById('emailInput');
        const passwordElement = mo.getElementById('passwordInput');
        const messageElement = mo.getElementById('loginMessage');
        const submitElement = mo.getElementById('submitButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            if (!loginFormElement.reportValidity()) return;

            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            const email = emailElement.value;
            const password = passwordElement.value;

            try
            {
                const json = await mo.fetchLogin({
                    Client: 1, // Web
                    Contact: email,
                    ContactType: 1, // Email
                    LocationLatitude: mo.locationLatitude,
                    LocationLongitude: mo.locationLongitude,
                    LocationPrecision: mo.locationPrecision,
                    LocationAltitude: mo.locationAltitude,
                    LocationAltitudePrecision: mo.locationAltitudePrecision,
                    Password: password,
                    UserAgent: navigator.userAgent,
                });

                if (json.ResultCode) return showError(json.ResultMessage);


                mo.setLoggedIn();

                const data = json.Data;

                mo.setPermission(data.Permission);
                mo.setUserType(data.UserType);

                messageElement.textContent = 'Success, redirecting...';
                messageElement.classList.toggle("loading");

                const urlSearchParams = new URLSearchParams(location.search);

                location.href = urlSearchParams.get('r') ?? '/';
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
