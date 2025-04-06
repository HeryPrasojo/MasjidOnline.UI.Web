mo.showError = async function (message)
{
    const dialogId = 'errorDialog';

    var errorDialog = mo.getElement(dialogId);

    if (!errorDialog)
    {
        const holder = mo.getElement('errorHolder');

        const text = await mo.fetchText('/html/error.html');

        if (!text)
        {
            holder.innerHTML = '!';

            return;
        }

        holder.innerHTML = text;

        errorDialog = mo.getElement(dialogId);
    }


    const errorMessage = mo.getElement('errorMessage');

    errorMessage.innerHTML = message;

    errorDialog.showModal();

    throw new Error(message);
}