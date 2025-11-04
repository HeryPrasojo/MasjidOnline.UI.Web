(function ()
{
    const fetchPremise = import('/js/fetch.js');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        await fetchPremise;

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
                        captchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'infaq' + mo.recaptchaActionAffix }),
                        email,
                        password,
                        userAgent: navigator.userAgent,

                    },
                });

            if (json.resultCode)
            {
                submitElement.classList.toggle("loading");
                submitElement.disabled = false;

                return messageElement.textContent = json.resultMessage;
            }

            mo.setLoggedIn();

            messageElement.textContent = 'Success, redirecting...';

            location.href = '/';
        }

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
