(async () =>
{
    import('/js/loading.js');

    await import('/js/envConfig.js');

    await import('/js/storage.js');

    await import('/js/fetch.js');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    function onDOMContentLoaded()
    {
        const passwordFormElement = getElementById('passwordForm');
        const passwordElement = getElementById('passwordInput');
        const password2Element = getElementById('password2Input');
        const messageElement = getElementById('messageElement');
        const submitElement = getElementById('submitButton');

        const urlSearchParams = new URLSearchParams(window.location.search);
        const passwordCode = urlSearchParams.get('c');
        if (!passwordCode)
        {
            messageElement.textContent = 'Password code invalid';
            messageElement.style.color = 'red';
            return;
        }

        const messageColor = messageElement.style.color;

        passwordElement.addEventListener('input', validatePasswordInput);
        password2Element.addEventListener('input', validatePasswordInput);

        submitElement.addEventListener('click', submitForm);

        function validatePasswordInput()
        {
            const password = passwordElement.value;
            const password2 = password2Element.value;

            const error = validatePassword(password);
            if (error)
            {
                messageElement.textContent = error;
                messageElement.style.color = 'red';
                return;
            }

            if (password !== password2)
            {
                messageElement.textContent = 'Passwords should match.';
                messageElement.style.color = 'red';
                return;
            }

            messageElement.style.color = messageColor;
            messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
        }

        async function submitForm()
        {
            try
            {
                if (!passwordFormElement.reportValidity()) return;

                const password = passwordElement.value;
                const password2 = password2Element.value;

                const passwordValidationResult = validatePassword(password);
                if (passwordValidationResult)
                    return messageElement.textContent = passwordValidationResult;

                if (password != password2)
                    return messageElement.textContent = 'Passwords should match.';


                messageElement.textContent = '\u00A0\u00A0\u00A0\u00A0';
                messageElement.style.color = messageColor;

                submitElement.disabled = true;
                submitElement.classList.toggle("loading");


                const json = await mo.fetchApiJson(
                    'user/setPassword',
                    {
                        body:
                        {
                            captchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'infaq' + mo.recaptchaActionAffix }),
                            passwordCode,
                            password,
                            password2,
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

                messageElement.textContent = 'Success, redirecting...';

                location.href = '/';
            }
            catch (err)
            {
                console.error(err);

                messageElement.textContent = err.message;
                messageElement.style.color = 'red';
            }

            submitElement.classList.toggle("loading");
            submitElement.disabled = false;
        }

        function getElementById(id)
        {
            return document.getElementById(id);
        }

        function validatePassword(password)
        {
            if (password.length < 8)
                return 'Password must be at least 8 characters long';

            if (password.length > 64)
                return 'Password must be at most 64 characters long';

            if (!/[a-z]/.test(password))
                return 'Password must contain at least one lowercase letter';

            if (!/[A-Z]/.test(password))
                return 'Password must contain at least one uppercase letter';

            if (!/\d/.test(password))
                return 'Password must contain at least one digit';

            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
                return 'Password must contain at least one symbol';

            return null;
        }
    }
})();
