if (navigator.geolocation)
{
    navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onGetCurrentPositionError, { enableHighAccuracy: false, });

    function onGetCurrentPositionSuccess(position)
    {
    }

    function onGetCurrentPositionError(error)
    {
    }
}
