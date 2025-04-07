mo.onDOMContentLoaded(async function ()
{
    const dialogId = 'generalDialog';

    var dialogElement = mo.getElement(dialogId);

    if (!dialogElement)
    {
        const holder = mo.getElement('dialogHolder');

        const text = await mo.fetchText('/html/dialog.html');

        if (!text)
        {
            holder.innerHTML = '!';

            return;
        }

        holder.innerHTML = text;

        dialogElement = mo.getElement(dialogId);
    }


    const messageElement = mo.getElement('dialogMessage');

    mo.showDialog = function (message)
    {
        messageElement.innerHTML = message;

        dialogElement.showModal();
    }
});
