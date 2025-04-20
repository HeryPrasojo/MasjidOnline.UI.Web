(function ()
{
	console.log((new Date()).toISOString() + ' pay start');

	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
	else
		onDOMContentLoaded();

	async function onDOMContentLoaded()
	{
		console.log((new Date()).toISOString() + ' pay DOM content start');

		loadManualBankTransfer();

		console.log((new Date()).toISOString() + ' pay DOM content finish');
	}

	function loadManualBankTransfer()
	{
		const instructionButton = getElementById('manualBankTransferInstructionButton');

		instructionButton.addEventListener('click', showInstruction);

		async function showInstruction()
		{
			try
			{
				const dialog = getElementById('manualBankTransferInstructionDialog');

				const confirmationButtonId = 'manualBankTransferConfirmationButton';
				var confirmationButton = getElementById(confirmationButtonId);

				if (!confirmationButton)
				{

					const text = await mo.fetchText('/html/infaq/manualBankTransferInstruction.html');

					dialog.innerHTML = text;

					const confirmationButton = getElementById(confirmationButtonId);

					confirmationButton.addEventListener('click', showConfirmation);
				}

				dialog.showModal();
			}
			catch (error)
			{
				console.error((new Date()).toISOString() + ' Error loading manual bank transfer instruction: ', error);
			}

			async function showConfirmation()
			{
				try
				{
					const confirmationDialog = getElementById('manualBankTransferConfirmationDialog');

					const manualBankTransferFormId = 'manualBankTransferForm';

					var manualBankTransferForm = getElementById(manualBankTransferFormId);

					if (!manualBankTransferForm)
					{
						const text = await mo.fetchText('/html/infaq/manualBankTransferConfirmation.html');

						confirmationDialog.innerHTML = text;

						manualBankTransferForm = getElementById(manualBankTransferFormId);

						const munfiqNameInput = getElementById('manualBankTransferMunfiqNameInput');
						const amountInput = getElementById('manualBankTransferAmountInput');
						const dateTimeInput = getElementById('manualBankTransferDateTimeInput');
						const notesInput = getElementById('manualBankTransferNotesInput');
						const filesInput = getElementById('manualBankTransferFilesInput');
						const submitButton = getElementById('manualBankTransferSubmitButton');
						const closeButton = getElementById('manualBankTransferConfirmationCloseButton');

						resetForm();

						filesInput.addEventListener('change', validateFiles);

						manualBankTransferForm.addEventListener('submit', submitForm);

						closeButton.addEventListener('click', closeConfirmation);

						function closeConfirmation()
						{
							confirmationDialog.close();
						}

						function resetForm()
						{
							manualBankTransferForm.reset();

							const now = new Date();
							const nowString = now.toISOString().split('Z')[0];

							dateTimeInput.setAttribute("max", nowString);
							dateTimeInput.setAttribute("value", nowString);
						}

						async function submitForm(e)
						{
							try
							{
								e.preventDefault();

								submitButton.disabled = true;

								const isCaptchaNeeded = mo.isCaptchaNeeded();

								// grecaptcha.enterprise.ready(async () => 
								// {
								const captchaAction = 'infaq';
								var captchaToken;

								if (isCaptchaNeeded)
									captchaToken = await grecaptcha.enterprise.execute('6LdSD_oqAAAAAOS497xVyGNjp5AAN-TpvCxk8b5R', { action: captchaAction });

								const formData = new FormData();

								formData.append('captchaAction', captchaAction);
								formData.append('captchaToken', captchaToken);
								formData.append('munfiqName', munfiqNameInput.value.trim());
								formData.append('amount', amountInput.value);
								formData.append('manualDateTime', dateTimeInput.value);
								formData.append('manualNotes', notesInput.value);
								formData.append('paymentType', 22);

								for (const file of filesInput.files)
									formData.append('files[]', file);

								const json = await mo.fetchApiJson(
									'infaq/infaq/add/anonym',
									{
										body: formData,
									});

								if (isCaptchaNeeded && (typeof captchaToken == 'string'))
									mo.setCaptchaPassed();

								resetForm();

								confirmationDialog.close();
								instructionDialog.close();

								mo.showDialog('Confirmation submitted. Thank you!');
								// });
							}
							catch (error)
							{
								console.error((new Date()).toISOString() + 'Error submitting manual bank transfer confirmation: ', error);
							}
						}

						async function validateFiles()
						{
							for (const file of filesInput.files)
							{
								if (file.size > 1048576)
								{
									filesInput.value = null;

									const manualBankTransferFilesDesccription = getElementById('manualBankTransferFilesDesccription');

									manualBankTransferFilesDesccription.innerHTML = 'File size too large: ' + file.name;

									break;
								}
							}
						}
					}

					confirmationDialog.showModal();
				}
				catch (error)
				{
					console.error((new Date()).toISOString() + 'Error loading manual bank transfer confirmation: ', error);
				}
			}
		}
	}

	function getElementById(id)
	{
		return document.getElementById(id);
	}

	console.log((new Date()).toISOString() + ' pay finish');
})();
