(async () =>
{
	import('/js/loading.js');

	await import('/js/envConfig.js');

	await import('/js/storage.js');

	await import('/js/fetch.js');

	import('/js/navigation.js');

})();
