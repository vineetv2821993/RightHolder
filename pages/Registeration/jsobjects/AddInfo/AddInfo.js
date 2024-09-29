export default {
	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0,
						v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	async submitRightHolderForm(){
		try{
			let rightHolderInfoId= this.generateUUID();
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
					digitalSignature: DigitalSignature.text,
					document: FilePicker1.files.length > 0 ?FilePicker1.files[0].data
					: null,
					inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				}
			);
			showAlert("form sucessfully submitted","info");
			resetWidget(Modal1.name);
			storeValue("rightHolderInfoId",rightHolderInfoId);
			navigateTo('Complaints', {}, 'SAME_WINDOW');
		}
		catch(ex){
			showAlert("error inserting the form,Please try after some time","error");
		}
	}
}