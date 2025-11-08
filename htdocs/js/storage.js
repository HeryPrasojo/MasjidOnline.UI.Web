(function ()
{
    const sessionIdStorageKey = 'sessionId';
    const isLoggedInStorageKey = 'isLoggedIn';

    mo.getSession = function ()
    {
        return localStorage.getItem(sessionIdStorageKey);
    };

    mo.removeSession = function ()
    {
        localStorage.removeItem(sessionIdStorageKey);

        mo.removeIsLoggedIn();
    };

    mo.setSession = function ()
    {
        localStorage.setItem(sessionIdStorageKey, true);
    }


    mo.removeIsLoggedIn = function ()
    {
        localStorage.removeItem(isLoggedInStorageKey);
    };

    mo.getIsLoggedIn = function ()
    {
        return localStorage.getItem(isLoggedInStorageKey);
    }

    mo.setLoggedIn = function ()
    {
        localStorage.setItem(isLoggedInStorageKey, true);
    }
})();
