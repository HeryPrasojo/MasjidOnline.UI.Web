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

    await Promise.all([
        import('/js/authorization.js'),
        import('/js/fetch.js'),
    ]);


    const urlSearchParams = new URLSearchParams(window.location.search);

    const registerCode = urlSearchParams.get('c');

    if (!registerCode) location.href = '/';


    mo.authorizeAnonymous();

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const formElement = mo.getElementById('registerForm');
        const emailElement = mo.getElementById('emailInput');
        const nameElement = mo.getElementById('nameInput');
        const passwordElement = mo.getElementById('passwordInput');
        const password2Element = mo.getElementById('password2Input');
        const ageementElement = mo.getElementById('ageementInput');
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

            if (!formElement.reportValidity()) return;


            const email = emailElement.value;
            const name = nameElement.value;
            const password = passwordElement.value;
            const password2 = password2Element.value;

            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
            messageElement.style.color = messageColor;

            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            try
            {
                const json = await mo.fetchVerifyRegister({
                    Client: 1, // Web
                    Contact: email,
                    ContactType: 1, // email
                    IsAcceptAgreement: ageementElement.checked,
                    Name: name,
                    RegisterCode: registerCode,
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
                mo.setUserType(3); // external

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
