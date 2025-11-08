(async () =>
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


    const connection = new signalR.HubConnectionBuilder()
        .withUrl(
            mo.hubUri,
            {
                headers:
                {
                    "Mo-Sess": mo.getSession(),
                },
                withCredentials: false,
            })
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.onclose(async () =>
    {
        await startConnection();
    });

    async function startConnection()
    {
        try
        {
            await connection.start();
        }
        catch (err)
        {
            console.log(err);
            //setTimeout(start, 5000);
        }
    };

    await startConnection();
})();
