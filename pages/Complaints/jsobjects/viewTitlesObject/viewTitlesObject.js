export default {
	titleData:[],
	countData:0,
	async viewTitle () {	
		await countTitles.run();
		await this.mappTitleData();
	},
	async mappTitleData() {
		// Fetch the default title data from the server
		let data = await getTitlesServerFilters.run();
		await countTitles.run();
		// If no search text is provided, use the default data
		if (Table1Copy.searchText === '') {
			this.titleData = data;
		} 
		// Otherwise, fetch filtered title data
		else {
			this.titleData = await getAllTitlesByRightHolder.run();
		}
	}
}