(() =>
{
    const apiUriPrefix = '//api.local.masjidonline.org:7271/';
    const environment = 'L';

    globalThis.mo = {
        apiUriPrefix: apiUriPrefix,
        environment: environment,
        hubUri: apiUriPrefix + 'hub',
        recaptchaActionAffix: '_' + environment,
        recaptchaSiteKey: '6LdSD_oqAAAAAOS497xVyGNjp5AAN-TpvCxk8b5R',
    };
})();
