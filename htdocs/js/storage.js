(() =>
{
    const applicationCultureStorageKey = 'applicationCulture';
    const isLoggedInStorageKey = 'isLoggedIn';
    const permissionStorageKey = 'permission'
    const recommendationNoteStorageKey = 'recommendationNote';
    const sessionIdStorageKey = 'sessionId';
    const userTypeStorageKey = 'userType';


    mo.getApplicationCulture = () =>
    {
        return localStorage.getItem(applicationCultureStorageKey);
    }

    mo.setApplicationCulture = (value) =>
    {
        localStorage.setItem(applicationCultureStorageKey, value);
    }


    mo.removeIsLoggedIn = () =>
    {
        localStorage.removeItem(isLoggedInStorageKey);

        mo.removePermission();

        mo.removeUserType();
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

        if (!stringValue) return;

        return JSON.parse(stringValue);
    };

    mo.removePermission = () =>
    {
        localStorage.removeItem(permissionStorageKey);
    };

    mo.setPermission = (value) =>
    {
        if (!value) return;

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
