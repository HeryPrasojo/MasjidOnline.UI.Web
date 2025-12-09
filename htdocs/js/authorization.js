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

    mo.authorizeInternal = () =>
    {
        mo.authorizeUser();

        if (mo.getUserType() != 5) location.href = '/';
    };

    mo.authorizePermission = (r, i) =>
    {
        if (i) mo.authorizeInternal();


        const p = mo.getPermission();

        for (var ri in r)
        {
            if (!p[ri]) return false;
        }

        return true;
    }

})();
