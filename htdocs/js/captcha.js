const fetchPremise = import('/js/fetch.js');

window.addEventListener('load', onWindowLoaded);

if (document.readyState == 'loading')
	document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
else
	onDOMContentLoaded();

let captchaCheckbox;

async function onDOMContentLoaded()
{
	await fetchPremise;

	captchaCheckbox = getElementById('captchaCheckbox');

	captchaCheckbox.addEventListener('click', submitForm);

	async function submitForm(e)
	{
		e.preventDefault();

		captchaCheckbox.disabled = true;

		captchaToken = await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'session' + mo.recaptchaActionAffix });

		var json = await mo.fetchApiJson(
			'session/create',
			{
				body:
				{
					captchaToken: captchaToken,
				},
			});

		// if (json.resultCode) location.reload();

		mo.setSession(json.data);

		const params = new URLSearchParams(window.location.search);

		location.href = params.get('r');
	}

	function getElementById(id)
	{
		return document.getElementById(id);
	}
}

function onWindowLoaded()
{
	captchaCheckbox.disabled = false;
}
