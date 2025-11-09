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
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.onclose(async () =>
    {
        console.log('Hub connection closed');
        if (mo.getIsLoggedIn()) startConnection();
    });

    async function startConnection()
    {
        try
        {
            console.log('Hub connection starting...');
            await connection.start();
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
