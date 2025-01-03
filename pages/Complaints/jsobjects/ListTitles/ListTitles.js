export default {
	index: 1, // Tracks the current index for new titles
	titleList: [
		{ id: 1, titleName: "", FilePicker2: [] } // Start with one empty title entry
	],

	// Function to add a new title entry
	addTitle: () => {
		const newId = ++this.index; // Increment index and generate new ID
		this.titleList.push({ id: newId, titleName: "", FilePicker2: [] }); // Add new entry
		this.updateListData(); // Refresh the List widget data
	},
	deleteInputField(id) {
		// Filter out the container with the matching ID

		const index = this.titleList.findIndex(item => item.id === id);
		// Check if the element is found
		if (index !== -1) {
			// Remove the element at the found index using splice
			this.titleList.splice(index, 1);
			List1.listData.push([...this.titleList]);
		}
	},

	// Function to reset the file list for a title entry
	removeFileListOnCrossClick: (id) => {
		const index = this.titleList.findIndex(item => item.id === id);
		if (index !== -1) {
			List2.listData[index].FilePicker2 = [];
			this.titleList[index].FilePicker2 = []; // Reset the file array
		}
	},
	handleInputChange(id, field, value) {
		console.log(field, "field", value);
		if (field === "FilePicker2") {
			const index = this.titleList.findIndex(item => item.id === id);
			if (index !== -1) {
				const currentFiles = this.titleList[index].FilePicker2 || [];
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
					this.titleList[index].FilePicker2 = combinedFiles;
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
