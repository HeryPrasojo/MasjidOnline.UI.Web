(() =>
{
    mo.authorizeAnonymous = () =>
    {
        if (mo.getIsLoggedIn()) location.href = '/';
    };

    mo.authorizeUser = () =>
    {
        if (!mo.getIsLoggedIn()) location.href = '/login?r=' + encodeURIComponent(location.href);
    };
})();
