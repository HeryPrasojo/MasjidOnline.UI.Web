mo.showError = async function (message)
{
    console.error(message);

    var errorDialog = mo.getElement('errorDialog');

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

        errorDialog = mo.getElement('errorDialog');
    }


    const errorMessageElement = mo.getElement('errorMessage');

    errorMessageElement.innerHTML = message;

    errorDialog.showModal();
}