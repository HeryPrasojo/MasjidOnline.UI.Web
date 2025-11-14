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
        if (mo.getIsLoggedIn()) startConnection();
    });

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
            console.log(err);

            setTimeout(startConnection, 4000);
        }
    };

    startConnection();


    mo.sendLogout = () =>
    {
        mo.removeIsLoggedIn();

        connection.invoke("UserUserLogoutAsync");
    }
})();
