(() =>
{
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


    let isWindowUnloaded = false;
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
        if (isWindowUnloaded) return;

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

    window.addEventListener(
        "unload",
        (event) =>
        {
            console.log('Hub connection stoping...\n' + event.type);
            isWindowUnloaded = true;

            connection.stop();
        }
    );

    if (mo.getIsLoggedIn()) startConnection();


    mo.sendLogout = async () =>
    {
        mo.removeIsLoggedIn();
        console.log("sending logout");
        const result = await connection.invoke("UserUserLogoutAsync");
        console.log("sendLogout: " + JSON.stringify(result));
    }

})();
