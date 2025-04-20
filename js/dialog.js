(function ()
{
    console.log((new Date()).toISOString() + ' dialog start');

    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        console.log((new Date()).toISOString() + ' dialog DOM content start');

        try
        {
            const dialogId = 'generalDialog';

            const dialogElement = getElementById(dialogId);
            var messageElement = getElementById('generalDialogMessage');

            if (!messageElement)
            {
                const text = await mo.fetchText('/html/dialog.html');

                dialogElement.innerHTML = text;

                messageElement = getElementById(dialogId);
            }

            mo.showDialog = function (message)
            {
                messageElement.innerHTML = message;

                dialogElement.showModal();
            };
        }
        catch (error)
        {
            console.error((new Date()).toISOString() + 'Error loading dialog: ', error);
        }

        function getElementById(id)
        {
            return document.getElementById(id);
        }

        console.log((new Date()).toISOString() + ' dialog DOM content finish');
    }

    console.log((new Date()).toISOString() + ' dialog finish');
})();
