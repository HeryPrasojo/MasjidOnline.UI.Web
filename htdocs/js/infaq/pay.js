const fetchPremise = import('/js/fetch.js');

if (document.readyState == 'loading')
	document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
else
	onDOMContentLoaded();

async function onDOMContentLoaded()
{
	await fetchPremise;

	loadManualBankTransfer();
}

async function loadManualBankTransfer()
{
	const instructionButton = getElementById('manualBankTransferInstructionButton');

	instructionButton.addEventListener('click', showInstruction);

	async function showInstruction()
	{
		var instructionDialog;
		var confirmationButton;
		var notesInput;

		const recommendationNoteStorageKey = 'recommendationNote';

		try
		{
			instructionButton.disabled = true;
			instructionButton.classList.toggle("loading");

			instructionDialog = getElementById('manualBankTransferInstructionDialog');

			var recommendationNoteElement;

			const confirmationButtonId = 'manualBankTransferConfirmationButton';
			confirmationButton = getElementById(confirmationButtonId);

			if (!confirmationButton)
			{
				const text = await mo.fetchText('/html/infaq/manualBankTransferInstruction.html');

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
							captchaToken: await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'session' + mo.recaptchaActionAffix }),
						},
					});

				recommendationNote = json.data;

				setLocalStorage(recommendationNoteStorageKey, recommendationNote);
			}

			recommendationNoteElement = getElementById('recommendationNote');

			recommendationNoteElement.innerHTML = recommendationNote;


			instructionDialog.showModal();

			instructionButton.disabled = false;
			instructionButton.classList.toggle("loading");
		}
		catch (error)
		{
			console.error((new Date()).toISOString() + ' Error loading manual bank transfer instruction: ', error);
		}

		async function showConfirmation()
		{
			confirmationButton.disabled = true;
			confirmationButton.classList.toggle("loading");

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
				notesInput = getElementById('manualBankTransferNotesInput');
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
					e.preventDefault();

					submitButton.disabled = true;
					submitButton.classList.toggle("loading");

					var captchaToken = await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: 'infaq' + mo.recaptchaActionAffix });

					const formData = new FormData();

					formData.append('captchaToken', captchaToken);
					formData.append('munfiqName', munfiqNameInput.value.trim());
					formData.append('amount', amountInput.value);
					formData.append('manualDateTime', dateTimeInput.value);
					formData.append('manualNotes', notesInput.value);
					formData.append('paymentType', 22);

					for (const file of filesInput.files)
						formData.append('files[]', file);

					await mo.fetchApiJson(
						'infaq/infaq/add/anonym',
						{
							body: formData,
						});

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

							const manualBankTransferFilesDesccription = getElementById('manualBankTransferFilesDesccription');

							manualBankTransferFilesDesccription.innerHTML = 'File size too large: ' + file.name;

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
