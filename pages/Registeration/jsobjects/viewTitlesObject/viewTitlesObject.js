export default {
	titleData:[],
	countData:0,
	async viewTitle () {	
		await countTitles.run();
		await this.mappTitleData();
		showModal(Modal8.name);
	},
	async mappTitleData() {
		// Fetch the default title data from the server
		await countTitles.run();
		let data = await getTitlesServerFilters.run();
		// If no search text is provided, use the default data
		if (Table1.searchText === '') {
			this.titleData = data;
		} 
		// Otherwise, fetch filtered title data
		else {
			this.titleData = await getAllTitlesByRightHolder.run();
		}
	}
}