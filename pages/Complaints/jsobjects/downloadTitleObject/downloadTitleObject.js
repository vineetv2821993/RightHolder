export default {
	async downloadXlsx(){
		let buffer = await downloadTitles.run();
		if (buffer) {
			download(buffer, "complaintsTitles.xlsx");
		} else {
			showAlert("Failed to download the Excel file", "error");
		}
	}
}