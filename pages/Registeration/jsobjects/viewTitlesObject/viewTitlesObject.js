export default {
	async viewTitle () {
		await getTitlesServerFilters.run();
		showModal(Modal8.name);
	}
}