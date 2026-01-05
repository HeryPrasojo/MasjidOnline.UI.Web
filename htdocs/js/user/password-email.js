(async () =>
{
    await import('/js/envConfig.js');

    await Promise.all([
        import('/js/common.js'),
        import('/js/form.js'),
        import('/js/storage.js'),
    ]);

    import('/js/loading.js');
    import('/js/geolocation.js');

    await import('/js/fetch.js');


    const urlSearchParams = new URLSearchParams(window.location.search);

    const passwordCode = urlSearchParams.get('c');

    if (!passwordCode) location.href = '/';


    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const passwordFormElement = mo.getElementById('passwordForm');
        const emailElement = mo.getElementById('emailInput');
        const passwordElement = mo.getElementById('passwordInput');
        const password2Element = mo.getElementById('password2Input');
        const messageElement = mo.getElementById('messageElement');
        const submitElement = mo.getElementById('submitButton');

        const messageColor = messageElement.style.color;

        passwordElement.addEventListener('input', validatePassword);
        password2Element.addEventListener('input', validatePassword2);

        submitElement.addEventListener('click', submitForm);

        function validatePassword()
        {
            mo.setCustomValidity(
                passwordElement,
                [
                    {
                        fn: (v) => /[a-z]/.test(v),
                        m: 'Password must contain at least one lowercase letter'
                    },
                    {
                        fn: (v) => /[A-Z]/.test(v),
                        m: 'Password must contain at least one uppercase letter'
                    },
                    {
                        fn: (v) => /\d/.test(v),
                        m: 'Password must contain at least one digit'
                    },
                    {
                        fn: (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v),
                        m: 'Password must contain at least one symbol'
                    }
                ]
            );
        };

        function validatePassword2()
        {
            mo.setCustomValidity(
                password2Element,
                [{
                    fn: (v) => v == passwordElement.value,
                    m: 'Confirmed password should match password'
                }]
            );
        }

        async function submitForm()
        {
            validatePassword();
            validatePassword2();

            if (!passwordFormElement.reportValidity()) return;


            const email = emailElement.value;
            const password = passwordElement.value;
            const password2 = password2Element.value;

            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            try
            {
                const json = await mo.fetchSetPassword({
                    Client: 1, // Web
                    Contact: email,
                    ContactType: 1, // email
                    PasswordCode: passwordCode,
                    Password: password,
                    Password2: password2,
                    LocationLatitude: mo.locationLatitude,
                    LocationLongitude: mo.locationLongitude,
                    LocationPrecision: mo.locationPrecision,
                    LocationAltitude: mo.locationAltitude,
                    LocationAltitudePrecision: mo.locationAltitudePrecision,
                    UserAgent: navigator.userAgent,
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
