(async () =>
{
    if (!mo.getIsLoggedIn()) return;

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(
            "//api.local.masjidonline.org:7271/hub",
            {
                headers: {
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
            console.log("connected");
        } catch (err)
        {
            console.log(err);
            //setTimeout(start, 5000);
        }
    };

    await startConnection();
})();
