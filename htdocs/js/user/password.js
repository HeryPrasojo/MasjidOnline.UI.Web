const fetchPremise = import('/js/fetch.js');

if (document.readyState == 'loading')
    document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
else
    onDOMContentLoaded();

async function onDOMContentLoaded()
{
    await fetchPremise;

    const urlSearchParams = new URLSearchParams(window.location.search);
    const passwordCode = urlSearchParams.get('c');

    const sessionId = mo.getSession();

    const formElement = getElementById('passwordForm');
    const passwordElement = getElementById('passwordInput');
    const password2Element = getElementById('password2Input');
    const messageElement = getElementById('messageElement');
    const submitElement = getElementById('submitButton');

    passwordElement.addEventListener('input', validatePasswordInput);
    password2Element.addEventListener('input', validatePasswordInput);

    // passwordElement.addEventListener('paste', validatePasswordInput);
    // password2Element.addEventListener('paste', validatePasswordInput);

    formElement.addEventListener('submit', submitForm);

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

        messageElement.textContent = '';
    }

    async function submitForm(event)
    {
        event.preventDefault();

        const password = passwordElement.value;
        const password2 = password2Element.value;

        if (password == '')
            return messageElement.textContent = 'Passwords should not empty.';

        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult)
            return messageElement.textContent = passwordValidationResult;

        if (password != password2)
            return messageElement.textContent = 'Passwords should match.';


        submitElement.disabled = true;
        submitElement.classList.toggle("loading");


        var captchaToken;

        const sessionId = mo.getSession();

        if (!sessionId)
            captchaToken = await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'infaq' + mo.recaptchaActionAffix });

        var json = await mo.fetchApiJson(
            'user/setPassword',
            {
                body:
                {
                    captchaToken,
                    passwordCode,
                    password,
                    password2,
                },
            });

        if (json.resultCode)
        {
            submitElement.classList.toggle("loading");
            submitElement.disabled = false;

            return messageElement.textContent = json.resultMessage;
        }

        if (!sessionId)
            mo.setSession(json.data);

        mo.setLoggedIn();

        messageElement.textContent = 'Success, redirecting...';

        location.href = '/';
    }

    function getElementById(id)
    {
        return document.getElementById(id);
    }

    function validatePassword(password)
    {
        if (password.length < 8)
            return 'Password must be at least 8 characters long';

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
