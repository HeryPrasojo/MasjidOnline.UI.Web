const moSessionIdStorageKey = 'sessionId';

mo.sessionIdHeaderName = 'Mo-Sess';

mo.isSessionExists = async function ()
{
    return mo.getSession() != null;
}

mo.getSession = async function ()
{
    return localStorage.getItem(moSessionIdStorageKey);
}

mo.setSession = async function (sessionId)
{
    localStorage.setItem(moSessionIdStorageKey, sessionId);
}