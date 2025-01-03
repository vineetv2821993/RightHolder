export default {
	async validate () {
		let lengthCheck;
		let lengthCheck1;
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
		if(!Select1.selectedOptionLabel){
			isValid = false;
			showAlert("Please Select the phone number code","error");
		}
		else if(Select1.selectedOptionLabel){
			lengthCheck = phoneLength.phoneLength.find(i => i.phone_code === Select1.selectedOptionLabel).phone_length;
		}
		if(!Select1Copy.selectedOptionLabel){
			isValid = false;
			showAlert("Please Select the confirm phone  number code","error");
		}
		else if(Select1Copy.selectedOptionLabel){
			lengthCheck1 = phoneLength.phoneLength.find(i => i.phone_code === Select1.selectedOptionLabel).phone_length;
		}
		if(Select1.selectedOptionLabel && Select1Copy.selectedOptionLabel){
			if(Select1.selectedOptionLabel  !== Select1Copy.selectedOptionLabel){
				isValid = false;
				showAlert("Phone Number Code and Confirm Phone Number Code do not match","error");
			}
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
		} else if (!new RegExp(`^\\d{${lengthCheck1}}$`).test(ConfirmPhoneNumber.text)) {  // Correct field reference
			console.log("ConfirmPhoneNumber.text",ConfirmPhoneNumber.text.length)
			isValid = false;
			showAlert(`Confirm Phone Number must be ${lengthCheck1} digits long`, "error");
		} else if (ConfirmPhoneNumber.text !== phoneNumber.text) {
			isValid = false;
			showAlert("Phone Number and Confirm Phone Number do not match", "error");
		}
		if(!CompanyName.text){
			isValid = false;
			showAlert("Company Name is required", "error");
		}
		const existingCompany = await getCompanyByPhoneNumber.run();
		if (existingCompany.length>0 && existingCompany[0].name !== CompanyName.text) {
			isValid = false;
			showAlert(`The phone number ${phoneNumber.text} is already associated with another company (${existingCompany[0].name})`, "error");
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
			showAlert("Country selection is required", "error");
		}
		if(!FilePicker1 || !FilePicker1.files || FilePicker1.files.length === 0){
			isValid = false;
			showAlert("At least one file needs to be uploaded", "error");
		}
		if(!FilePicker2 || !FilePicker2.files || FilePicker2.files.length === 0){
			isValid = false;
			showAlert("At least one copy rigth letter file needs to be uploaded", "error");
		}
		if(!FilePicker1Copy || !FilePicker1Copy.files || FilePicker1Copy.files.length === 0){
			isValid = false;
			showAlert("At least one content Content Ownership Certificate needs to be uploaded", "error");
		}  
		let data = await getAllTitlesByRightHolder.run();
		if(data && data.length === 0){
			isValid = false;
			showAlert("Please Add Atleast one title, By clicking on the Add Title Button", "warning");
		}  
		if(isValid){
			showModal(Modal1.name)
		}
	},


}