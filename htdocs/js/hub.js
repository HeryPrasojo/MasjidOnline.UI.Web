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
        .withServerTimeout(64000)
        .withUrl(
            mo.hubUri,
            {
                accessTokenFactory: () => sessionId,
                withCredentials: false,
            })
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    connection.onclose(async () =>
    {
        console.log('closed');
        if (mo.getIsLoggedIn()) startConnection();
    });

    connection.on('logout', () =>
    {
        console.log('logout');
        mo.removeIsLoggedIn();

        location.href = '/';
    });


    mo.receiveUserInternalList = (request) =>
    {
        return invoke("UserInternalGetMany", request);
    }

    mo.receiveUserInternalView = (request) =>
    {
        return invoke("UserInternalGetOne", request);
    }

    mo.sendLogout = () =>
    {
        invoke("UserUserLogout");
    }

    mo.sendUserInternalAdd = async (request) =>
    {
        await addRequestCaptchaToken(request, 'addInternalUser');

        return invoke("UserInternalAdd", request);
    }

    globalThis.moHub =
    {
        sendUserInternalApprove: (request) =>
        {
            return invoke("UserInternalApprove", request);
        },
        sendUserInternalCancel: (request) =>
        {
            return invoke("UserInternalCancel", request);
        },
        sendUserInternalReject: (request) =>
        {
            return invoke("UserInternalReject", request);
        },
    }

    startConnection();


    // TODO move to captcha.js

    async function addRequestCaptchaToken(body, action)
    {
        if (body instanceof FormData)
        {
            if (!body.has('CaptchaToken'))
            {
                const captchaToken = await getCaptchaToken(action);

                body.append('CaptchaToken', captchaToken);
            }
        }
        else
        {
            if (!body.CaptchaToken)
            {
                const captchaToken = await getCaptchaToken(action);

                body.CaptchaToken = captchaToken;
            }
        }
    }

    async function getCaptchaToken(action)
    {
        return await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: action + mo.recaptchaActionAffix });
    }

    function invoke(methodName, ...requests)
    {
        return connection.invoke(methodName, ...requests);
    }

    async function startConnection()
    {
        try
        {
            await connection.start();

            if (!mo.isHubStarted)
            {
                mo.isHubStarted = true;


                const onHubStartedEvent = new Event("hubStarted");

                document.dispatchEvent(onHubStartedEvent);
            }
        }
        catch (err)
        {
            if (!err.message == 'Failed to complete negotiation with the server: TypeError: Failed to fetch')
            {
                console.log(err.name + ': ' + err.message);
            }

            setTimeout(startConnection, 4000);
        }
    };

})();
