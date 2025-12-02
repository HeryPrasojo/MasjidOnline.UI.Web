(async () =>
{
    import('/js/loading.js');

    await import('/js/envConfig.js');
    await import('/js/storage.js');
    await import('/js/authorization.js');

    import('/js/fetch.js');
    import('/js/geolocation.js');

    mo.authorizeAnonymous();

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const loginFormElement = getElementById('loginForm');
        const emailElement = getElementById('emailInput');
        const passwordElement = getElementById('passwordInput');
        const messageElement = getElementById('loginMessage');
        const submitElement = getElementById('submitButton');

        const messageColor = messageElement.style.color;

        submitElement.addEventListener('click', submitForm);

        async function submitForm()
        {
            try
            {
                if (!loginFormElement.reportValidity()) return;

                messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
                messageElement.style.color = messageColor;

                submitElement.disabled = true;
                submitElement.classList.toggle("loading");

                const email = emailElement.value;
                const password = passwordElement.value;

                const json = await mo.fetchApiJson(
                    'user/login',
                    {
                        body:
                        {
                            CaptchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'login' + mo.recaptchaActionAffix }),
                            EmailAddress: email,
                            Password: password,
                            UserAgent: navigator.userAgent,
                            Client: 1, // Web
                            LocationLatitude: mo.locationLatitude,
                            LocationLongitude: mo.locationLongitude,
                            LocationPrecision: mo.locationPrecision,
                            LocationAltitude: mo.locationAltitude,
                            LocationAltitudePrecision: mo.locationAltitudePrecision,
                        },
                    });

                if (json.ResultCode)
                {
                    submitElement.classList.toggle("loading");
                    submitElement.disabled = false;

                    messageElement.textContent = json.ResultMessage;
                    messageElement.style.color = 'red';

                    return;
                }

                mo.setLoggedIn();

                mo.setPermission(json.Data.Permission);

                messageElement.textContent = 'Success, redirecting...';

                const urlSearchParams = new URLSearchParams(location.search);

                location.href = urlSearchParams.get('r') ?? '/';
            }
            catch (error)
            {
                messageElement.textContent = error.message;
                messageElement.style.color = 'red';

                submitElement.classList.toggle("loading");
                submitElement.disabled = false;
            }
        }

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
