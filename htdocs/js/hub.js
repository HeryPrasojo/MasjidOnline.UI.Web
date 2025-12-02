(() =>
{
    if (!mo.getIsLoggedIn()) return;


    var lockResolver;

    if (navigator && navigator.locks && navigator.locks.request)
    {
        const promise = new Promise(
            (res) =>
            {
                lockResolver = res;
            }
        );

        navigator.locks.request(
            'moAntiSleepLock',
            { mode: "shared" },
            () =>
            {
                return promise;
            }
        );
    }


    const sessionId = mo.getSession();

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(
            mo.hubUri,
            {
                accessTokenFactory: () => sessionId,
                headers:
                {
                    "Mo-Sess": sessionId,
                },
                withCredentials: false,
            })
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    connection.onclose(async () =>
    {
        console.log('closed');
        if (mo.getIsLoggedIn()) startConnection();
    });

    mo.receiveUserList = (request) =>
    {
        return invoke("UserInternalList", request);
    }

    mo.sendLogout = () =>
    {
        mo.removeSession();

        invoke("UserUserLogout");
    }

    startConnection();


    function invoke(methodName, ...requests)
    {
        return connection.invoke(methodName, ...requests);
    }

    async function startConnection()
    {
        try
        {
            console.log('Connecting...');
            await connection.start();
            console.log('Connected');
        }
        catch (err)
        {
            console.log(err.name);
            console.log(err.message);

            setTimeout(startConnection, 4000);
        }

        if (mo.onHubStarted) mo.onHubStarted();
    };
})();
