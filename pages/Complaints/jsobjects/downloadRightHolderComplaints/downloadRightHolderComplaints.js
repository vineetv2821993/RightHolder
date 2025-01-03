export default {
	async downloadXlsx(){
		let buffer = await downloadComplaints.run();
		if (buffer) {
			download(buffer, "complaints.xlsx");
		} else {
			showAlert("Failed to download the Excel file", "error");
		}
	}
}