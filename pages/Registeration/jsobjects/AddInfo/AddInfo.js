export default {
	insertQuery:'',
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
		const expireAt = moment.utc(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');

		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')


		// Check if the current time is after the expire_at time
		if (moment(currentTime).isAfter(expireAt)) {
			console.log("expire1","1");

			return true;  // Session expired
		}
		console.log("expire2","2");

		return false;  // Session is still valid
	},

	async submitRightHolderForm(){
		let rightHolderInfoId= this.generateUUID();
		try{
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
						inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
						updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
					}
				);
				await UpdateContentOwerShip.run({
					id: rightHolderInfoId,
					contentOwnerShip:FilePicker1Copy.files.length > 0 ?FilePicker1Copy.files[0].data.replace(/^data:image\/\w+;base64,/, '') : null

				})
				await UpdateIndentificationProff.run({
					id: rightHolderInfoId,
					indentificationProff: FilePicker1.files.length > 0 ?FilePicker1.files[0].data.replace(/^data:image\/\w+;base64,/, '')
					: null
				})
				await UpdateCopyRigthLetter.run({
					id: rightHolderInfoId,
					copyRightLetter: FilePicker2.files.length>0 ? FilePicker2.files[0].data.replace(/^data:image\/\w+;base64,/, '') : null
				})
				// await removeValue("indentificationProff");
				// await removeValue("copyRightLetter");
				// await removeValue("contentOwnerShip");

				showAlert("form sucessfully submitted","info");
				resetWidget(Modal1.name);
				storeValue("rightHolderInfoId",rightHolderInfoId);
				setTimeout(function() {
					navigateTo('Login', {}, 'SAME_WINDOW');
				}, 15000);
				await showModal(Modal1Copy.name);
				await SendEmail.run();

			}
			else{
				showAlert("Session is expire , please login again","warning");
				navigateTo('Login', {}, 'SAME_WINDOW');
			}
		}
		catch(ex){
			console.log(ex.message);
			if(ex.message !='Payload too large. File size cannot exceed 100MB.'){
				deleteRightHolder.run({
					id: rightHolderInfoId
				})	
				showAlert(`error inserting the form,Please try after some time${ex.message}`,"error");
			}
			console.log(ex);

		}
	}
}