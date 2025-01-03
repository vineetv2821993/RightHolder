export default {
	index: 1, // Tracks the current index for new titles
	titleList: [
		{ id: 1, titleName: "", FilePicker2Copy: [] } // Start with one empty title entry
	],

	// Function to add a new title entry
	addTitle: () => {
		const newId = ++this.index; // Increment index and generate new ID
		this.titleList.push({ id: newId, titleName: "", FilePicker2Copy: [] }); // Add new entry
		this.updateListData(); // Refresh the List widget data
	},
	deleteInputField(id) {
		// Filter out the container with the matching ID

		const index = this.titleList.findIndex(item => item.id === id);
		// Check if the element is found
		if (index !== -1) {
			console.log("asd")
			// Remove the element at the found index using splice
			this.titleList.splice(index, 1);
			List2.listData.push([...this.titleList]);
		}
	},

	removeFileListOnCrossClick: (id) => {
		// Find the index of the item to reset
		const index = this.titleList.findIndex(item => item.id === id);

		if (index !== -1) {
			// Update the titleList array directly
			this.titleList[index].FilePicker2Copy = []; // Clear the file array for the selected item
			List2.listData[index].FilePicker2Copy = [];
			// Reset the FilePicker widget for the specific item
			resetWidget('FilePicker2Copy',true);

			console.log("FilePicker reset for item:", id, this.titleList[index]);
		} else {
			console.log("Item not found for id:", id);
		}
	},
	handleInputChange(id, field, value) {
		console.log(field, "field", value);
		if (field === "FilePicker2Copy") {
			const index = this.titleList.findIndex(item => item.id === id);
			if (index !== -1) {
				const currentFiles = this.titleList[index].FilePicker2Copy || [];
				const newFiles = value.filter(
					file => !currentFiles.some(existingFile => existingFile.name === file.name)
				);
				// Remove files that are no longer present in the value array
				const updatedFiles = currentFiles.filter(
					existingFile => value.some(file => file.name === existingFile.name)
				);

				// Combine updated existing files with new files
				const combinedFiles = [...updatedFiles, ...newFiles];

				// Check the file count limit
				if (combinedFiles.length <= 3) {
					this.titleList[index].FilePicker2Copy = combinedFiles;
				} else {
					console.warn("Cannot add more than 3 files.");
				}
			}
		} else {
			this.titleList = this.titleList.map(item =>
																					item.id === id ? { ...item, [field]: value } : item
																				 );
		}
		this.	updateListData();
	},

	// Helper function to update the List widget data
	updateListData: () => {
		List2.listData.push([...this.titleList]);
	}
};
