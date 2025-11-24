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
        const formElement = getElementById('loginForm');
        const emailElement = getElementById('emailInput');
        const passwordElement = getElementById('passwordInput');
        const messageElement = getElementById('loginMessage');
        const submitElement = getElementById('submitButton');

        formElement.addEventListener('submit', submitForm);

        async function submitForm(event)
        {
            event.preventDefault();

            const email = emailElement.value;
            const password = passwordElement.value;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

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

                return messageElement.textContent = json.ResultMessage;
            }

            mo.setLoggedIn();

            mo.setPermission(json.Data.Permission);

            messageElement.textContent = 'Success, redirecting...';

            const urlSearchParams = new URLSearchParams(location.search);

            location.href = urlSearchParams.get('r') ?? '/';
        }

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
