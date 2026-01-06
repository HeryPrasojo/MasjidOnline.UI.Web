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

    mo.authorizePermission = (r) =>
    {
        mo.authorizeInternal();


        const p = mo.getPermission();

        if (!p) return false;

        for (var ri in r)
        {
            if (!p[ri]) return false;
        }

        return true;
    }

})();

globalThis.moAuthorization =
{
    showInternal: () =>
    {
        const isLoggedIn = mo.getIsLoggedIn();

        if (isLoggedIn)
        {
            const userType = mo.getUserType();

            // internal
            if (userType == 5)
            {
                document.querySelectorAll('.internal').forEach((element) =>
                {
                    element.classList.remove('internal');
                });
            }
        }
    },
    showInternalPermission: (permission) =>
    {
        const p = mo.getPermission();

        if (!p) return;

        for (const pi in permission)
        {
            if (p[pi]) 
            {
                for (const s of permission[pi])
                {
                    document.querySelectorAll(s).forEach((element) =>
                    {
                        element.classList.remove('internalPermission');
                    });
                }
            }
        }
    },
};
