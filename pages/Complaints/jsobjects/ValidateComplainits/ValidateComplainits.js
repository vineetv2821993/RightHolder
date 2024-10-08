export default {
	async validateComplaints() {
		let isValid = true;
		let errorMessage = "";
		console.log("List1.listData before validation: ", AddListInput.listArray);

		// Validate Category selection
		if (!Select2 || !Select2.selectedOptionLabel) {
			isValid = false;
			errorMessage = "Please select a Category.\n";
		}
		// Validate Original Work / Copyright input
		else if (!originalWork || originalWork.text.trim() === "") {
			isValid = false;
			errorMessage = "Please provide the Original Work / Copyright.";
		}
		// Validate checkbox fields
		else if (!Checkbox1.isChecked) {
			isValid = false;
			errorMessage += "Please acknowledge the Good Faith Belief and Authority to act.";
		}
		// Validate if at least one Infringing URL and Description is added
		else if(List1.listData.length === 0) {
			isValid = false;
			errorMessage = "Please add at least one Infringing URL and Description.\n";
		}
		else {
			// Loop through the dynamically added fields for validation
			const urlSet = new Set();

			for(let i=0;i<AddListInput.listArray.length ;i++){
				console.log(AddListInput.listArray[i], "item.input1");
				if (!AddListInput.listArray[i].input1 || AddListInput.listArray[i].input1.trim() === "") {
					isValid = false;
					errorMessage = `Infringing URL is missing in item ${i + 1}.`;
				} else if (!AddListInput.listArray[i].FilePicker1 || AddListInput.listArray[i].FilePicker1.trim() === "") {
					isValid = false;
					errorMessage = `Please Provide proof for Infringing URL ${AddListInput.listArray[i].input1} in item ${i + 1}.`;
				} else if (!AddListInput.listArray[i].Description || AddListInput.listArray[i].Description.trim() === "") {
					isValid = false;
					errorMessage = `Description is missing in item ${i + 1}.`;
				} else if (urlSet.has(AddListInput.listArray[i].input1.trim())) {
					isValid = false;List1.listData
					errorMessage = `Duplicate Infringing URL (${AddListInput.listArray.input1}) found in the list at item ${i + 1}. Please remove the duplicate.`;
				} else {
					urlSet.add(AddListInput.listArray[i].input1.trim());
					let data = await GetExitsInfringingUrl.run({infringing_url: AddListInput.listArray[i].input1.trim()});
					if (data && data.length>0) {
						isValid = false;
						errorMessage = `This Infringing URL (${AddListInput.listArray[i].input1}) has already been submitted. To proceed with the complaint, please remove the duplicate URL from the list or use a different Infringing URL. For assistance, contact SAIP.`;
					}
				}
			}
		}
		// Show alert if validation fails
		if (!isValid) {
			showAlert(errorMessage,"error");
		}
		else{
			showModal(Modal2.name);

		}
	}
}
