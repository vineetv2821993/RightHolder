export default {
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

	async submitRightHolderForm(){
		try{
			let rightHolderInfoId= this.generateUUID();

			if(!await this.checkExpireUser()){
				await AddRightHolderInfo.run(
					{
						rightHolderUserId: appsmith.store.rightHolderUserId,
						id: rightHolderInfoId,
						fullName: Name.text,
						rightHolderName: HolderName.text,
						company_name: CompanyName.text,
						email: EmailAddress.text,
						phoneNumber:  Select1.selectedOptionLabel +'-' + phoneNumber.text,
						address: Address.text,
						city: City.text,
						state: State.text,
						country: Select2Copy.selectedOptionLabel, // Replace with actual country value
						acknowledgment: Checkbox1Copy.isChecked,
						status: "Under Review",
						digitalSignature: DigitalSignature.text,
						document: FilePicker1.files.length > 0 ?FilePicker1.files[0].data
						: null,
						copyRightLetter: FilePicker2.files.length>0 ? FilePicker2.files[0].data : null,
						inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
						updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
					}
				);
				showAlert("form sucessfully submitted","info");
				resetWidget(Modal1.name);
				storeValue("rightHolderInfoId",rightHolderInfoId);
				await showModal(Modal1Copy.name);
				setTimeout(function() {
					navigateTo('Login', {}, 'SAME_WINDOW');
				}, 15000);
				await SendEmail.run();
			}
			else{
				showAlert("Session is expire , please login again","warning");
				navigateTo('Login', {}, 'SAME_WINDOW');
			}
		}
		catch(ex){
			showAlert("error inserting the form,Please try after some time","error");
		}
	}
}