export default {
	validate () {
		let lengthCheck = phoneLength.phoneLength.find(i => i.phone_code === Select1.selectedOptionLabel).phone_length;
		console.log("lengthCheck",lengthCheck);
		let isValid = true;
		if(!Name || !Name.text){
			isValid = false;
			showAlert("Name is required", "error");
		}
		if(!HolderName.text){
			isValid = false;

			showAlert("Holder Name is required", "error");
		}
		if(!EmailAddress.text){
			isValid = false;
			showAlert("Email Address is required", "error");
		}
		if (!phoneNumber.text) {
			isValid = false;
			showAlert("Phone Number is required", "error");
		} else if (!new RegExp(`^\\d{${lengthCheck}}$`).test(phoneNumber.text)) {  // Proper interpolation and regex creation
			isValid = false;
			showAlert(`Phone Number must be ${lengthCheck} digits long`, "error");
		}

		if (!ConfirmPhoneNumber.text) {
			isValid = false;
			showAlert("Confirm Phone Number is required", "error");
		} else if (!new RegExp(`^\\d{${lengthCheck}}$`).test(ConfirmPhoneNumber.text)) {  // Correct field reference
			isValid = false;
			showAlert(`Confirm Phone Number must be ${lengthCheck} digits long`, "error");
		} else if (ConfirmPhoneNumber.text !== phoneNumber.text) {
			isValid = false;
			showAlert("Phone Number and Confirm Phone Number do not match", "error");
		}
		if(!CompanyName.text){
			isValid = false;
			showAlert("Company Name is required", "error");
		}

		if(!DigitalSignature.text){
			isValid = false;
			showAlert("Digital Signature is required", "error");
		}

		if(!Address.text){
			isValid = false;
			showAlert("Address is required", "error");
		}
		if(!City.text){
			isValid = false;
			showAlert("City is required", "error");
		}
		if(!State.text){
			isValid = false;
			showAlert("State is required", "error");
		}
		if(!Select2Copy || !Select2Copy.selectedOptionValue){
			isValid = false;
			showAlert("Select2Copy selection is required", "error");
		}
		if(!FilePicker1 || !FilePicker1.files || FilePicker1.files.length === 0){
			isValid = false;
			showAlert("At least one file needs to be uploaded", "error");
		}
		if(!FilePicker2 || !FilePicker2.files || FilePicker2.files.length === 0){
			isValid = false;
			showAlert("At least one copy rigth letter file needs to be uploaded", "error");
		}
		if(isValid){
			showModal(Modal1.name)
		}
	},


}