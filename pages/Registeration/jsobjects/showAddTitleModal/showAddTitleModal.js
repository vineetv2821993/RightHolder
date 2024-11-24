export default {
	resetWidgets() {
		// removeValue();\
		ListTitles.titleList = [{
			id:1,
			titleName:"",
			FilePicker2Copy: []
		}]
		resetWidget("List2");
		console.log("listti4EL",ListTitles.titleList)
	},
	titleModal() {
		this.resetWidgets(); // Corrected: No additional ()
		showModal(Modal2.name); // Corrected: Use the modal's name as a string
	},
};
