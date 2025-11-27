(() =>
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const messageElementId = 'generalDialogMessage';

        const dialogElement = getElementById('generalDialog');
        var messageElement = getElementById(messageElementId);

        if (!messageElement)
        {
            const text = await mo.fetchText('/html/dialog.html');

            dialogElement.innerHTML = text;

            messageElement = getElementById(messageElementId);
        }

        mo.showDialog = function (message)
        {
            messageElement.innerHTML = message;

            dialogElement.showModal();
        };

        function getElementById(id)
        {
            return document.getElementById(id);
        }
    }
})();
