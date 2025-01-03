export default {
	async updateTitle() {
		try {
			// Extract and decode the Base64 data portion from ownershipImage.data
			const base64Data = FilePicker2Copy.files.length > 0 
			? FilePicker2Copy.files[0].data.split(',')[1] 
			: Table1Copy.triggeredRow.ownershipImage.split(',')[1];

			if (!base64Data) {
				showAlert("Invalid image data format for title: " + Input15.text, "error");
				return; // Exit the function if the data is invalid
			}

			// Prepare the update object
			let updateObject = {
				id: Table1Copy.triggeredRow.id,
				name:Input15.text,
				ownershipImage: base64Data,
				updated_at: moment().format("YYYY-MM-DD HH:mm:ss") // Format the date using Moment.js
			};
			// Run the update query
			await updateTiles.run(updateObject);
			// Show success alert
			showAlert("Title updated successfully!", "success");
			await getAllTitlesByRightHolder.run();
			await getTitlesServerFilters.run();
			closeModal(Modal13.name);
		} catch (error) {
			// Catch and display any errors
			console.error("Error updating title:", error);
			showAlert(`Failed to update title: ${error.message}`, "error");
		}
	}
};
