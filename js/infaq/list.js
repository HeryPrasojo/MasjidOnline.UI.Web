mo.onDOMContentLoaded(async function ()
{
    var json = await mo.fetchApiJson(
        'infaq/infaq/getMany',
        {
            body:
            {
                page: 1,
            },
        });

    for (const record of json.records)
    {
        const tr = document.createElement('tr');
    }
    console.log((new Date()).toISOString() + ' load list');
});