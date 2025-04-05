mo.onDOMContentLoaded(async function ()
{
	const manualBankTransferForm = mo.getElement('manualBankTransferForm');
	const manualBankTransferMunfiqNameInput = mo.getElement('manualBankTransferMunfiqNameInput');
	const manualBankTransferAmountInput = mo.getElement('manualBankTransferAmountInput');
	const manualBankTransferDateTimeInput = mo.getElement('manualBankTransferDateTimeInput');
	const manualBankTransferNotesInput = mo.getElement('manualBankTransferNotesInput');
	const manualBankTransferFilesInput = mo.getElement('manualBankTransferFilesInput');
	const manualBankTransferSubmitButton = mo.getElement('manualBankTransferSubmitButton');
	const successDialog = mo.getElement('successDialog');

	const now = new Date();
	const nowString = now.toISOString().split('Z')[0];

	manualBankTransferDateTimeInput.setAttribute("max", nowString);
	manualBankTransferDateTimeInput.setAttribute("value", nowString);

	manualBankTransferFilesInput.addEventListener('change', validateFiles);

	manualBankTransferForm.addEventListener('submit', submitInfaq);


	function validateFiles()
	{
		for (const file of manualBankTransferFilesInput.files)
		{
			if (file.size > 1048576)
			{
				manualBankTransferFilesInput.value = null;

				return mo.showError('File size too large: ' + file.name);
			}
		}
	}

	async function submitInfaq(e)
	{
		e.preventDefault();
		
		for (const file of manualBankTransferFilesInput.files)
		{
			if (file.size > 1048576)
				return mo.showError(file);
		}

		manualBankTransferSubmitButton.disabled = true;
		
		const isCaptchaNeeded = await mo.isCaptchaNeeded();

		grecaptcha.enterprise.ready(async () => 
		{
			const captchaAction = 'infaq';
			var captchaToken;

			if (isCaptchaNeeded)
				captchaToken = await grecaptcha.enterprise.execute('6LdSD_oqAAAAAOS497xVyGNjp5AAN-TpvCxk8b5R', { action: captchaAction });

			const formData = new FormData();

			formData.append('captchaAction', captchaAction);
			formData.append('captchaToken', captchaToken);
			formData.append('munfiqName', manualBankTransferMunfiqNameInput.value.trim());
			formData.append('amount', manualBankTransferAmountInput.value);
			formData.append('manualDateTime', manualBankTransferDateTimeInput.value);
			formData.append('manualNotes', manualBankTransferNotesInput.value);
			formData.append('paymentType', mo.paymentType.manualBankTransfer);

			for (const file of manualBankTransferFilesInput.files)
				formData.append('files[]', file);

			json = await mo.fetchApiJson(
				'infaq/infaq/add/anonym',
				{
					body: formData,
				});
			
			if (json.resultCode != mo.apiResultCode.success)
				return mo.showError(JSON.stringify(json));

			if (isCaptchaNeeded && (typeof captchaToken == 'string'))
				mo.setCaptchaPassed();

			successDialog.show();
		});
	}

	console.log('load infaq');
});
