(async () =>
{
	import('/js/loading.js');

	await import('/js/envConfig.js');

	await import('/js/storage.js');

	await import('/js/fetch.js');

	import('/js/navigation.js');

	import('/js/dialog.js');


	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
	else
		onDOMContentLoaded();

	function onDOMContentLoaded()
	{
		loadbankTransfer();
	}

	async function loadbankTransfer()
	{
		const instructionButton = getElementById('bankTransferInstructionButton');

		instructionButton.addEventListener('click', showInstruction);

		async function showInstruction()
		{
			var instructionDialog;
			var confirmationButton;
			var notesInput;

			const recommendationNoteStorageKey = 'recommendationNote';

			instructionButton.disabled = true;
			instructionButton.classList.toggle("loading");

			instructionDialog = getElementById('bankTransferInstructionDialog');

			var recommendationNoteElement;

			const confirmationButtonId = 'bankTransferConfirmationButton';
			confirmationButton = getElementById(confirmationButtonId);

			if (!confirmationButton)
			{
				const text = await mo.fetchText('/html/infaq/bankTransferInstruction.html');

				instructionDialog.innerHTML = text;


				confirmationButton = getElementById(confirmationButtonId);

				confirmationButton.addEventListener('click', showConfirmation);
			}


			var recommendationNote = localStorage.getItem(recommendationNoteStorageKey);

			if (!recommendationNote)
			{
				const json = await mo.fetchApiJson(
					'payment/manual/getRecommendationNote',
					{
						body:
						{
							captchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'recommendationNotes' + mo.recaptchaActionAffix }),
						},
					});

				if (json.ResultCode)
					return mo.showDialog('Error: ' + json.ResultMessage);

				recommendationNote = json.Data;

				setLocalStorage(recommendationNoteStorageKey, recommendationNote);
			}

			recommendationNoteElement = getElementById('recommendationNote');

			recommendationNoteElement.innerHTML = recommendationNote;


			instructionDialog.showModal();

			instructionButton.disabled = false;
			instructionButton.classList.toggle("loading");

			async function showConfirmation()
			{
				confirmationButton.disabled = true;
				confirmationButton.classList.toggle("loading");

				const confirmationDialog = getElementById('bankTransferConfirmationDialog');

				const bankTransferFormId = 'bankTransferForm';

				var bankTransferForm = getElementById(bankTransferFormId);

				if (!bankTransferForm)
				{
					const text = await mo.fetchText('/html/infaq/bankTransferConfirmation.html');

					confirmationDialog.innerHTML = text;

					bankTransferForm = getElementById(bankTransferFormId);

					const munfiqNameInput = getElementById('bankTransferMunfiqNameInput');
					const amountInput = getElementById('bankTransferAmountInput');
					const dateTimeInput = getElementById('bankTransferDateTimeInput');
					notesInput = getElementById('bankTransferNotesInput');
					const filesInput = getElementById('bankTransferFilesInput');
					const submitButton = getElementById('bankTransferSubmitButton');
					const closeButton = getElementById('bankTransferConfirmationCloseButton');

					resetForm();

					filesInput.addEventListener('change', validateFiles);

					bankTransferForm.addEventListener('submit', submitForm);

					closeButton.addEventListener('click', closeConfirmation);

					function closeConfirmation()
					{
						confirmationDialog.close();
					}

					function resetForm()
					{
						bankTransferForm.reset();

						const now = new Date();
						now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
						const nowString = now.toISOString().split('Z')[0];

						dateTimeInput.setAttribute("max", nowString);
						dateTimeInput.setAttribute("value", nowString);
					}

					async function submitForm(e)
					{
						e.preventDefault();

						submitButton.disabled = true;
						submitButton.classList.toggle("loading");

						var captchaToken = await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'infaq' + mo.recaptchaActionAffix });

						const formData = new FormData();

						const date = new Date(dateTimeInput.value);

						formData.append('captchaToken', captchaToken);
						formData.append('munfiqName', munfiqNameInput.value.trim());
						formData.append('amount', amountInput.value);
						formData.append('manualDateTime', date.toISOString());
						formData.append('manualNotes', notesInput.value);
						formData.append('paymentType', 22);

						for (const file of filesInput.files)
							formData.append('files[]', file);

						const json = await mo.fetchApiJson(
							'infaq/infaq/add/anonym',
							{
								body: formData,
							});

						if (json.ResultCode)
							return mo.showDialog('Error: ' + json.ResultMessage);

						localStorage.removeItem(recommendationNoteStorageKey);

						resetForm();

						submitButton.classList.toggle("loading");
						submitButton.disabled = false;

						confirmationDialog.close();
						instructionDialog.close();

						mo.showDialog('Confirmation submitted. Thank you!');
					}

					async function validateFiles()
					{
						for (const file of filesInput.files)
						{
							if (file.size > 1048576)
							{
								filesInput.value = null;

								const bankTransferFilesDesccription = getElementById('bankTransferFilesDesccription');

								bankTransferFilesDesccription.innerHTML = 'File size too large: ' + file.name;

								break;
							}
						}
					}
				}

				notesInput.value = localStorage.getItem(recommendationNoteStorageKey);

				confirmationButton.disabled = false;
				confirmationButton.classList.toggle("loading");

				confirmationDialog.showModal();
			}
		}
	}

	function getElementById(id)
	{
		return document.getElementById(id);
	}

	function setLocalStorage(key, value)
	{
		if ((typeof value != 'undefined') || (value != null))
			localStorage.setItem(key, value);
	}
})();
