onDOMContentLoaded(async function()
{
	const isUserSessionExists = moCheckUserSessionExists();

	// if (isUserSessionExists) return 1;
	

	const manualBankTransferForm = moGetElement('manualBankTransferForm');
	const manualBankTransferMunfiqNameInput = moGetElement('manualBankTransferMunfiqNameInput');
	const manualBankTransferAmountInput = moGetElement('manualBankTransferAmountInput');
	const manualBankTransferDateTimeInput = moGetElement('manualBankTransferDateTimeInput');
	const manualBankTransferNotesInput = moGetElement('manualBankTransferNotesInput');
	const manualBankTransferSubmitButton = moGetElement('manualBankTransferSubmitButton');
	const successDialog = moGetElement('successDialog');

	const now = new Date();
	const nowString = now.toISOString().split('Z')[0];

	manualBankTransferDateTimeInput.setAttribute("max", nowString);
	manualBankTransferDateTimeInput.setAttribute("value", nowString);

	manualBankTransferForm.addEventListener('submit', submitInfaq);


	function submitInfaq(e)
	{
		e.preventDefault();
		
		manualBankTransferSubmitButton.disabled = true;
		
		grecaptcha.enterprise.ready(async () => 
		{
			const captchaAction = 'infaq';
			
			const token = await grecaptcha.enterprise.execute('6LdSD_oqAAAAAOS497xVyGNjp5AAN-TpvCxk8b5R', {action: captchaAction});
			
			const json = await moFetchApiJson(
				'infaq/infaq/add/anonym',
				{
					body: JSON.stringify(
					{
						captchaAction: captchaAction,
						captchaToken: token,
						munfiqName: manualBankTransferMunfiqNameInput.value.trim(),
						amount: manualBankTransferAmountInput.value,
						manualDateTime: manualBankTransferDateTimeInput.value,
						manualNotes: manualBankTransferNotesInput.value,
						paymentType: globalThis.paymentType.manualBankTransfer,
					}),
				});
			
			if (json.resultCode != moApiResultCode.success)
				throw new Error(json);
			
			successDialog.show();
		});
	}
console.log('load infaq');
});
