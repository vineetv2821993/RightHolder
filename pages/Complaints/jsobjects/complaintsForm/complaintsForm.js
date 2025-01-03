export default {
	newComplaintCaseId: '',
	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	async checkExpireUser() {
		// Fetch the expire_at value from the database
		let expireDate = await checkExpire.run({id:appsmith.store.rightHolderUserId});
		if (expireDate.length === 0) {

			return true;  // User not found
		}
		const expireAt = moment.utc(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');


		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')


		// Check if the current time is after the expire_at time
		if (moment(currentTime).isAfter(expireAt)) {
			return true;  // Session expired
		}
		return false;  // Session is still valid
	},
	async submitForm() {
		if (!await this.checkExpireUser()) {
			const complaint_Case_id = await CountComplaintForm.run();
			let countIndex = complaint_Case_id[0].count;
			let errors = []; // To collect error messages

			try {
				for (let i = 0; i < AddListInput.listArray.length; i++) {
					let isUnique = false;
					let complaint_form_id = this.generateUUID();
					let complaint_status_id = this.generateUUID();

					// Generate a unique complaint_case_id
					while (!isUnique) {
						countIndex++;
						const indexCount = countIndex < 10 ? `0${countIndex}` : countIndex;

						// Create new complaint case ID
						this.newComplaintCaseId = `${Input12.text}-${complaint_Case_id[0].count}-${indexCount}-${moment().format("YYYY-MM-DD")}`;
						let existingRecord = await CheckComplaintCaseId.run({ complaint_Case_id: this.newComplaintCaseId });

						// Proceed if the ID is unique
						if (!existingRecord || existingRecord.length === 0) {
							isUnique = true;
						}
					}

					// Insert the form
					try {
						await insertComplaintForm.run({
							complaint_form_id: complaint_form_id,
							complaint_request_id: `${Input12.text}-${complaint_Case_id[0].count}-${moment().format("YYYY-MM-DD")}`,
							complaint_Case_id: this.newComplaintCaseId,
							category_type: Select2.selectedOptionLabel,
							acknowledgment: Checkbox1.isChecked,
							original_work: originalWork.text,
							rightHolderUserId: appsmith.store.rightHolderUserId,
							infringing_url: AddListInput.listArray[i].input1,
							description: AddListInput.listArray[i].Description,
							inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
							updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
						});

						// Insert images
						for (let j = 0; j < AddListInput.listArray[i].FilePicker1.length; j++) {
							const image_id = this.generateUUID();
							// Removing prefix to keep only the actual Base64 data
							const base64Data = AddListInput.listArray[i].FilePicker1[j].data.replace(/^data:image\/\w+;base64,/, '');

							await insertComplaintFormImage.run({
								image_id: image_id,
								image_data:  base64Data,
								complaint_form_id: complaint_form_id,
								inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
								updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
							});
						}

						// Insert into complaint status form
						await insertComplaintsStatusForm.run({
							complaint_status_id: complaint_status_id,
							complaint_form_id: complaint_form_id,
							status: 'Under Review',
							reason_of_approve_reject: null,
							status_updated_by: null,
							inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
							updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
						});

						await UpdateComplaintTitle.run({
							complaint_form_id: complaint_form_id,
							updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
							id: Select3.selectedOptionValue
						})

					} catch (ex) {
						console.error(`Error while inserting forms for item ${i}:`, ex);

						// Rollback if an error occurs
						try {
							await deleteComplaintsStatusForm.run({ complaint_status_id: complaint_status_id });

							await deleteComplaintForm.run({ complaint_form_id: complaint_form_id });

						} catch (rollbackEx) {
							console.error(`Error during rollback for complaint ID ${complaint_form_id}:`, rollbackEx);
							errors.push(`Error during rollback for complaint ID ${complaint_form_id}`);
						}

						errors.push(`Error inserting form for item ${i}: ${ex.message}`);
					}
				}
			} catch (outerEx) {
				console.error("An error occurred during submission:", outerEx);
				errors.push("An unexpected error occurred during submission. Please try again later.");
			}

			// Show alerts based on errors
			if (errors.length > 0) {
				showAlert("Some errors occurred:\n" + errors.join("\n"), "error");
				this.resetWidgets();
			} else {
				this.resetForm();
				showAlert("All forms successfully submitted", "info");
				resetWidget("Select3",true);
				closeModal(Modal2.name);
			}
		} else {
			// Session expired message and redirection to login
			showAlert("Session has expired, please login again", "warning");
			navigateTo('Login', {}, 'SAME_WINDOW');
		}
	},

	resetWidgets() {
		resetWidget("Select2", true);
		resetWidget("originalWork", true);
		resetWidget("List1", true);
		resetWidget("Checkbox1", true);
	},

	resetForm() {
		AddListInput.listArray = [
			{ id: 1, 
			 input1: '', Description: '', FilePicker1: [] }
		];
		this.resetWidgets();
	}
};
