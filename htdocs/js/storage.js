(function ()
{
    const sessionIdStorageKey = 'sessionId';
    const isLoggedInStorageKey = 'isLoggedIn';
    const permissionStorageKey = 'permission'


    mo.getPermission = function ()
    {
        const stringValue = localStorage.getItem(permissionStorageKey);

        return JSON.parse(stringValue);
    };

    mo.removePermission = function ()
    {
        localStorage.removeItem(permissionStorageKey);
    };

    mo.setPermission = function (value)
    {
        const stringValue = JSON.stringify(value);

        localStorage.setItem(permissionStorageKey, stringValue);
    }


    mo.getSession = function ()
    {
        return localStorage.getItem(sessionIdStorageKey);
    };

    mo.removeSession = function ()
    {
        localStorage.removeItem(sessionIdStorageKey);

        mo.removeIsLoggedIn();

        mo.removePermission();
    };

    mo.setSession = function (id)
    {
        localStorage.setItem(sessionIdStorageKey, id);
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
