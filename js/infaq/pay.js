mo.onDOMContentLoaded(function ()
{
	loadManualBankTransfer();

	function loadManualBankTransfer()
	{
		const instructionButton = mo.getElement('manualBankTransferInstructionButton');

		instructionButton.addEventListener('click', showInstruction);

		async function showInstruction()
		{
			const dialogId = 'manualBankTransferInstructionDialog';

			var instructionDialog = mo.getElement(dialogId);

			if (!instructionDialog)
			{
				const holder = mo.getElement('manualBankTransferInstructionHolder');

				const text = await mo.fetchText('/html/infaq/manualBankTransferInstruction.html');

				if (!text)
				{
					holder.innerHTML = '!';

					return;
				}

				holder.innerHTML = text;


				instructionDialog = mo.getElement(dialogId);

				const confirmationButton = mo.getElement('manualBankTransferConfirmationButton');

				confirmationButton.addEventListener('click', showConfirmation);
			}

			instructionDialog.showModal();

			async function showConfirmation()
			{
				const dialogId = 'manualBankTransferConfirmationDialog';

				var confirmationDialog = mo.getElement(dialogId);

				if (!confirmationDialog)
				{
					const holder = mo.getElement('manualBankTransferConfirmationHolder');

					const text = await mo.fetchText('/html/infaq/manualBankTransferConfirmation.html');

					if (!text)
					{
						holder.innerHTML = '!';

						return;
					}

					holder.innerHTML = text;


					confirmationDialog = mo.getElement(dialogId);

					const manualBankTransferForm = mo.getElement('manualBankTransferForm');
					const munfiqNameInput = mo.getElement('manualBankTransferMunfiqNameInput');
					const amountInput = mo.getElement('manualBankTransferAmountInput');
					const dateTimeInput = mo.getElement('manualBankTransferDateTimeInput');
					const notesInput = mo.getElement('manualBankTransferNotesInput');
					const filesInput = mo.getElement('manualBankTransferFilesInput');
					const submitButton = mo.getElement('manualBankTransferSubmitButton');
					const closeButton = mo.getElement('manualBankTransferConfirmationCloseButton');

					resetForm();

					filesInput.addEventListener('change', validateFiles);

					manualBankTransferForm.addEventListener('submit', submitForm);

					closeButton.addEventListener('click', closeConfirmation);

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
						e.preventDefault();

						submitButton.disabled = true;

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
							formData.append('munfiqName', munfiqNameInput.value.trim());
							formData.append('amount', amountInput.value);
							formData.append('manualDateTime', dateTimeInput.value);
							formData.append('manualNotes', notesInput.value);
							formData.append('paymentType', mo.paymentType.manualBankTransfer);

							for (const file of filesInput.files)
								formData.append('files[]', file);

							json = await mo.fetchApiJson(
								'infaq/infaq/add/anonym',
								{
									body: formData,
								});

							if (json.resultCode != mo.apiResultCode.success)
								await mo.showError(JSON.stringify(json));

							if (isCaptchaNeeded && (typeof captchaToken == 'string'))
								mo.setCaptchaPassed();

							resetForm();

							confirmationDialog.close();
							instructionDialog.close();

							mo.showDialog('Confirmation submitted. Thank you!');
						});
					}

					async function validateFiles()
					{
						for (const file of filesInput.files)
						{
							if (file.size > 1048576)
							{
								filesInput.value = null;

								await mo.showError('File size too large: ' + file.name);
							}
						}
					}
				}

				confirmationDialog.showModal();

				function closeConfirmation()
				{
					confirmationDialog.close();
				}
			}
		}
	}

	console.log((new Date()).toISOString() + ' pay load');
});
