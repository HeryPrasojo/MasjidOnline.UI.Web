(() =>
{
    mo.getElementById = (id) => document.getElementById(id);

    mo.setCustomValidity = (el, os) =>
    {
        var cvs = '';

        os.forEach((o, i) => 
        {
            if (!o.fn(el.value)) cvs = cvs ? (cvs + '\n- ' + o.m) : ('- ' + o.m);
        });

        el.setCustomValidity(cvs);
    };

})();
