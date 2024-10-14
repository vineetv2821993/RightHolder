export default {
	newComplaintCaseId:'',
	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0,
						v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	async checkExpireUser() {
		// Fetch the expire_at value from the database
		let expireDate = await checkExpire.run({id:appsmith.store.rightHolderUserId});
		if (expireDate.length === 0) {

			return true;  // User not found
		}
		const expireAt = moment(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');


		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')


		// Check if the current time is after the expire_at time
		if (moment(currentTime).isAfter(expireAt)) {
			return true;  // Session expired
		}
		return false;  // Session is still valid
	},
	async submitForm() {
		if (!await this.checkExpireUser()) {
			let complaint_Case_id = await CountComplaintForm.run();
			let countIndex = complaint_Case_id[0].count;
			let indexCount=countIndex;
			let errors = []; // To collect error messages

			try {
				for (let i = 0; i < AddListInput.listArray.length; i++) {
					let isUnique = false;
					let complaint_form_id = this.generateUUID();
					let complaint_status_id = this.generateUUID();
					console.log("isUnique",isUnique,i);
					while (!isUnique) {
						countIndex += 1;

						if (countIndex < 10) {
							indexCount = `0${countIndex}`;
						}
						else{
							indexCount=countIndex;
						}
						console.log("isUnique",isUnique,i,countIndex);


						// Check if the complaint_Case_id is unique
						this.newComplaintCaseId = `${Input12.text}-${complaint_Case_id[0].count}-${indexCount}-${moment().format("YYYY-MM-DD")}`;
						let existingRecord = await CheckComplaintCaseId.run({ complaint_Case_id:this.newComplaintCaseId });
						console.log("existingRecord",existingRecord);
						if (!existingRecord || existingRecord.length === 0) {
							isUnique = true; // Proceed if the ID is unique
						}
					}
					console.log("conyins",`${Input12.text}-${complaint_Case_id[0].count}-${countIndex}-${moment().format("YYYY-MM-DD")}`);
					// Proceed with inserting the form
					try {
						await insertComplaintForm.run({
							complaint_form_id: complaint_form_id,
							complaint_request_id: `${Input12.text}-${complaint_Case_id[0].count}-${moment().format("YYYY-MM-DD")}`,
							complaint_Case_id: `${this.newComplaintCaseId}`,
							category_type: Select2.selectedOptionLabel,
							acknowledgment: Checkbox1.isChecked,
							original_work: originalWork.text,
							rightHolderUserId: appsmith.store.rightHolderUserId,
							infringing_url:AddListInput.listArray[i].input1,
							documentProff: AddListInput.listArray[i].FilePicker1,
							description: AddListInput.listArray[i].Description,
							inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
							updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
						});

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

					} catch (ex) {
						console.error("Error while inserting forms for item " + i + ":", ex);

						// Rollback if an error occurs
						try {
							await deleteComplaintForm.run({ complaint_form_id: complaint_form_id });
							await deleteComplaintsStatusForm.run({ complaint_status_id: complaint_status_id });
						} catch (rollbackEx) {
							console.error("Error during rollback for complaint ID " + complaint_form_id + ":", rollbackEx);
							errors.push("Error during rollback for complaint ID " + complaint_form_id);
						}

						errors.push("Error inserting form for item " + i + ": " + ex.message);
					}
				}
			} catch (outerEx) {
				console.error("An error occurred during submission:", outerEx);
				errors.push("An unexpected error occurred during submission. Please try again later.");
			}

			if (errors.length > 0) {
				showAlert("Some errors occurred:\n" + errors.join("\n"), "error");
				resetWidget("Select2", true);
				resetWidget("originalWork", true);
				resetWidget("List1", true);
				resetWidget("Checkbox1", true);
			} else {
				showAlert("All forms successfully submitted", "info");
				closeModal(Modal2.name);
				AddListInput.listArray= [
					{ 
						id: this.index, 
						input1: '', 
						Description: '',
						FilePicker1:'' 
					}
				],
					resetWidget("Select2", true);
				resetWidget("originalWork", true);
				resetWidget("List1", true);
				resetWidget("Checkbox1", true);
			}
		} else {
			// Session expired message and redirection to login
			showAlert("Session has expired, please login again", "warning");
			navigateTo('Login', {}, 'SAME_WINDOW');
		}
	}

}
