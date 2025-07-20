(function ()
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const code = urlSearchParams.get('c');

        const formElement = getElementById('passwordForm');
        const passwordElement = getElementById('passwordInput');
        const password2Element = getElementById('password2Input');
        const messageElement = getElementById('messageElement');
        const submitElement = getElementById('submitButton');

        formElement.addEventListener('submit', submitForm);

        async function submitForm(event)
        {
            event.preventDefault();

            const password = passwordElement.value;
            const password2 = password2Element.value;

            if (password == '')
                return messageElement.textContent = 'Passwords should not empty.';

            if (password != password2)
                return messageElement.textContent = 'Passwords should match.';


            submitElement.disabled = true;
            submitElement.classList.toggle("loading");

            var json = await mo.fetchApiJson(
                'user/setPassword',
                {
                    body:
                    {
                        code,
                        password,
                        password2,
                    },
                });

            if (json.resultCode != 0)
            {
                submitElement.classList.toggle("loading");
                submitElement.disabled = false;

                return messageElement.textContent = json.resultMessage;
            }

            messageElement.textContent = 'Success, redirecting...';
        }

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
