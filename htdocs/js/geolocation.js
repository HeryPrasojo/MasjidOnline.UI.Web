(() =>
{
    mo.locationLatitude = null;
    mo.locationLongitude = null;
    mo.locationPrecision = null;
    mo.locationAltitude = null;
    mo.locationAltitudePrecision = null;

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onGetCurrentPositionError, { enableHighAccuracy: true, });
    }

    function onGetCurrentPositionSuccess(position)
    {
        mo.locationLatitude = position.coords.latitude;
        mo.locationLongitude = position.coords.longitude;
        mo.locationPrecision = position.coords.accuracy;
        mo.locationAltitude = position.coords.altitude;
        mo.locationAltitudePrecision = position.coords.altitudeAccuracy;
    }

    function onGetCurrentPositionError(error)
    {
    }
})();
