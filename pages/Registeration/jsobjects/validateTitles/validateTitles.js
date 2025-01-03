export default {
	async validateTitles() {
		let isValid = true;
		let errorMessage = "";

		console.log("Title List before validation: ", ListTitles.titleList);

		// Validate if at least one title entry exists
		if (ListTitles.titleList.length === 0) {
			isValid = false;
			errorMessage = "Please add at least one title entry.\n";
		} else {
			const titleSet = new Set();

			for (let i = 0; i < ListTitles.titleList.length; i++) {
				const titleEntry = ListTitles.titleList[i];
				console.log("titleEntry",titleEntry);
				// Validate title name presence
				if (!titleEntry.titleName || titleEntry.titleName.trim() === "") {
					isValid = false;
					errorMessage += `Title name is missing in item ${i + 1}.\n`;
				} 
				// Validate proof file input
				else if (!titleEntry.FilePicker2Copy || titleEntry.FilePicker2Copy.length === 0) {
					isValid = false;
					errorMessage += `Please provide proof files for title "${titleEntry.titleName}" in item ${i + 1}.\n`;
				} 
				// Check for duplicate titles
				else if (titleSet.has(titleEntry.titleName.trim())) {
					isValid = false;
					errorMessage += `Duplicate title name ("${titleEntry.titleName}") found in the list at item ${i + 1}.\n`;
				} else {
					titleSet.add(titleEntry.titleName.trim());
					let titleData = await getComplaintsTitles.run({ title_name: titleEntry.titleName.trim() }); // Adjust as necessary
					if (titleData && titleData.length > 0) {
						isValid = false;
						errorMessage = `This title "${titleEntry.titleName}" has already been submitted. Please choose a different title.`;
						break; // Exit loop if invalid
					}
				}
			}
		}


		if(!Checkbox1.isChecked){
			isValid= false;
			errorMessage = `Please confirm that all tiles are correct by selecting the checkbox.`;
		}
		// Show alert if validation fails
		if (!isValid) {
			showAlert(errorMessage, "error");
		} else {
			await AddTitles.addTitles();
			// showModal(Modal2Copy.name);
		}
	}
};
