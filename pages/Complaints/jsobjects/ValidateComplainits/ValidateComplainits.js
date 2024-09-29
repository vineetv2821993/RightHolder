export default {
	async validateComplaints() {
		let isValid = true;
		let errorMessage = "";

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

			List1.listData.forEach(async (item, index) => {
				// Check if infringing URL is missing
				if (!item.input1 || item.input1.trim() === "") {
					isValid = false;
					errorMessage = `Infringing URL is missing in item ${index + 1}.`;
				} 		else if(!item.FilePicker1  || item.FilePicker1.trim() === ""){
					isValid = false;
					errorMessage =`Please Provide us proof for Infringing  URL ${item.input1}  in item  ${index + 1}.`;;
				}
				// Check if description is missing
				else if (!item.Description || item.Description.trim() === "") {
					isValid = false;
					errorMessage = `Description is missing in item ${index + 1}.`;
				} 
				// Check if the URL is a duplicate in the list
				else if (urlSet.has(item.input1.trim())) {
					isValid = false;
					errorMessage = `Duplicate Infringing URL (${item.input1}) found in the list at item ${index + 1}. Please remove the duplicate.`;
				} 
				// Add the URL to the Set for tracking duplicates
				else {
					urlSet.add(item.input1.trim());
					// Check if the URL exists in the database
					if (await GetExitsInfringingUrl.run({ infringing_url: item.input1.trim() })) {
						isValid = false;
						errorMessage = `This Infringing URL (${item.input1}) has already been submitted. To proceed with the complaint, please remove the duplicate URL from the list or use a different Infringing URL. For assistance, contact SAIP.`;
					}
				}
			})
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
