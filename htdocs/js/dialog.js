(() =>
{
    if (document.readyState == 'loading')
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    else
        onDOMContentLoaded();

    async function onDOMContentLoaded()
    {
        const dialogElement = mo.getElementById('generalDialog');

        const messageElementId = 'generalDialogMessage';

        var messageElement = mo.getElementById(messageElementId);

        if (!messageElement)
        {
            try
            {
                const text = await mo.fetchText('/html/dialog.html');

                dialogElement.innerHTML = text;

                messageElement = mo.getElementById(messageElementId);
            }
            catch (err)
            {
                alert(err);
            }
        }

        mo.showDialog = (message, onClose) =>
        {
            if (!messageElement)
            {
                alert(message);

                return;
            }

            messageElement.innerHTML = message;

            dialogElement.showModal();

            if (onClose) dialogElement.addEventListener('close', onClose, { once: true });
        };
    }
})();
