mo.onDOMContentLoaded(function ()
{
    const loadingDialog = mo.getElement('loadingDialog');
    const messageElement = mo.getElement('loadingMessage');

    mo.showLoading = function (message)
    {
        const loadingDialogOpened = loadingDialog.open;

        if (!loadingDialogOpened)
        {
            messageElement.innerHTML = message ?? 'Loading';

            loadingDialog.showModal();
        }

        return !loadingDialogOpened;
    };

    mo.closeLoading = function ()
    {
        loadingDialog.close();
    };

    loadingDialog.show();
});

window.addEventListener('load', function ()
{
    mo.closeLoading();
});