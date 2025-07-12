(function () 
{
    document.addEventListener("DOMContentLoaded", onLoaded);

    function onLoaded()
    {
        const navigationPortraitTheRestButton = document.getElementById('navigationPortraitTheRestButton');
        const navigationPortraitTheRest = document.getElementById('navigationPortraitTheRest');

        navigationPortraitTheRestButton.addEventListener("click", onClick);

        function onClick()
        {
            navigationPortraitTheRest.classList.toggle("display-none");
        }
    }
}
)();
