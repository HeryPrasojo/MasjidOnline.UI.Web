(() =>
{
    const isLoggedInStorageKey = 'isLoggedIn';
    const permissionStorageKey = 'permission'
    const recommendationNoteStorageKey = 'recommendationNote';
    const sessionIdStorageKey = 'sessionId';
    const userTypeStorageKey = 'userType';


    mo.removeIsLoggedIn = () =>
    {
        localStorage.removeItem(isLoggedInStorageKey);
    };

    mo.getIsLoggedIn = () =>
    {
        return localStorage.getItem(isLoggedInStorageKey);
    }

    mo.setLoggedIn = () =>
    {
        localStorage.setItem(isLoggedInStorageKey, true);
    }


    mo.getPermission = () =>
    {
        const stringValue = localStorage.getItem(permissionStorageKey);

        return JSON.parse(stringValue);
    };

    mo.removePermission = () =>
    {
        localStorage.removeItem(permissionStorageKey);
    };

    mo.setPermission = (value) =>
    {
        const stringValue = JSON.stringify(value);

        localStorage.setItem(permissionStorageKey, stringValue);
    }


    mo.removeRecommendationNote = () =>
    {
        localStorage.removeItem(recommendationNoteStorageKey);
    };

    mo.getRecommendationNote = () =>
    {
        return localStorage.getItem(recommendationNoteStorageKey);
    }

    mo.setRecommendationNote = (note) =>
    {
        localStorage.setItem(recommendationNoteStorageKey, note);
    }


    mo.getSession = () =>
    {
        return localStorage.getItem(sessionIdStorageKey);
    };

    mo.removeSession = () =>
    {
        localStorage.removeItem(sessionIdStorageKey);

        mo.removeIsLoggedIn();

        mo.removePermission();

        mo.removeUserType();
    };

    mo.setSession = (id) =>
    {
        localStorage.setItem(sessionIdStorageKey, id);
    }


    mo.getUserType = () =>
    {
        return localStorage.getItem(userTypeStorageKey);
    }

    mo.removeUserType = () =>
    {
        localStorage.removeItem(userTypeStorageKey);
    };

    mo.setUserType = (type) =>
    {
        localStorage.setItem(userTypeStorageKey, type);
    }

})();
