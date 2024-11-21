export default {
	index:1,
	// Initial list array to hold dynamic fields, starting with one entry
	listArray: [{ id: this.index, input1: '', Description: '', FilePicker1: [] }],
	lsitPageNo:1,

	// Function to add new input fields dynamically
	Button5onClick() {
		// Generate a unique ID for each new entry
		this.index = this.index+1;
		const newId = this.index;

		// Add a new input field object to the array
		this.listArray.push({ id: newId, input1: '', Description: '',FilePicker1: []});

		// Log the updated list data to the console
		console.log("Updated List: ", this.listArray);

		// Update the List1 widget data with the new input fields array
		List1.listData.push(this.listArray);
		const itemsPerPage = List1.pageSize; // The number of items per page
		const totalItems = this.listArray.length;
		this.lsitPageNo = Math.ceil(totalItems / itemsPerPage); // Calculate the page 

	},

	// Function to delete an input field container
	deleteInputField(id) {
		// Filter out the container with the matching ID
		const index = this.listArray.findIndex(item => item.id === id);
		// Check if the element is found
		if (index !== -1) {

			// Remove the element at the found index using splice
			this.listArray.splice(index, 1);
			List1.listData.push(this.listArray);
		}
		// Log the updated list data to the console
		console.log("Updated List after delete: ", this.listArray);

	},
	removeFileListOnCrosssClick(id) {
		const index = this.listArray.findIndex(item => item.id === id);
		if (index !== -1) {
			List1.listData[List1.pageNo-1].FilePicker1 = [];
			this.listArray[index].FilePicker1 = []; // Reset the file array
			resetWidget("FilePicker1", true); // Reset the FilePicker widget
		}
		console.log("File list after reset: ", this.listArray);
	},
	// Function to handle input changes
	handleInputChange(id, field, value) {
		// Update the specific field of the relevant input row
		console.log(field,"field",value)
		if (field === "FilePicker1") {
			const index = this.listArray.findIndex(item => item.id === id);
			if (index !== -1) {
				if (this.listArray[index].FilePicker1.length < 3) {
					this.listArray[index].FilePicker1.push(value); // Add new file
				} else {
					console.warn("Cannot add more than 3 files."); // Warning when trying to add more than 3
				}
			}
		}
		else{
			this.listArray = this.listArray.map(item => 
																					item.id === id ? { ...item, [field]: value } : item
																				 );
		}

		// Log the changes for debugging
		console.log("Updated Input Fields: ", this.listArray);

		// Update the List1 widget data
		List1.listData.push(this.listArray);
	},
}
