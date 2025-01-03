export default {
	async deleteMutipleTitles() {
		try {
			// Extracting the ids from selected rows
			let ids = Table1Copy.selectedRows.map(item => `'${item.id}'`);
			ids = ids.join(", ");
			// Running the delete operation
			await deleteMutipleTitles.run({ selectedIds: ids });

			// If the deletion is successful, show success alert
			showAlert("Titles deleted successfully!", "success");
			await getTitlesServerFilters.run()
		} catch (error) {
			// Catching any errors and showing an error alert
			console.error("Error deleting titles:", error);
			showAlert(`Failed to delete titles: ${error.message}`, "error");
		}
	}
};
