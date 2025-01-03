export default {
	whereFilter: "",
	async filtersObject() {
		try {
			let where = await this.applyCondition(Select4Copy1.selectedOptionValue, Select4CopyCopy.selectedOptionLabel, Input16Copy.text);
			console.log("where", where);
			this.whereFilter = ` and ${where}`;

			// Fetch data with the updated filter
			await countTitles.run();
			let data = await getTitlesServerFilters.run();
			viewTitlesObject.titleData = data;

			// Reset widgets and close modal
			closeModal(Modal15Copy.name);
			// resetWidget("Select4Copy1", true);
			// resetWidget("Select4CopyCopy", true);
			// resetWidget("Input16Copy", true);
		} catch (error) {
			console.error("Error in filtersObject:", error);
			showAlert("An error occurred while applying filters. Please try again.", "error");
		}
	},

	async clearFilter() {
		try {
			this.whereFilter = '';

			// Fetch data without filters
			await countTitles.run();
			let data = await getTitlesServerFilters.run();
			viewTitlesObject.titleData = data;

			// Reset widgets
			resetWidget("Select4Copy1", true);
			resetWidget("Select4CopyCopy", true);
			resetWidget("Input16Copy", true);
		} catch (error) {
			console.error("Error in clearFilter:", error);
			showAlert("An error occurred while clearing filters. Please try again.", "error");
		}
	},


	async applyCondition(field, condition, value) {
		try {
			let whereClause;
			let tableName="complaints_title";
			switch (condition) {
				case 'Contains':
					whereClause = `${tableName}.${field} LIKE '%${value}%'`;
					break;
				case 'Does Not Contain':
					whereClause = `${tableName}.${field} NOT LIKE '%${value}%'`;
					break;
				case 'Starts With':
					whereClause = `${tableName}.${field} LIKE '${value}%'`;
					break;
				case 'Ends With':
					whereClause = `${tableName}.${field} LIKE '%${value}'`;
					break;
				case 'Is Exactly':
					whereClause = `${tableName}.${field} = '${value}'`;
					break;
				case 'Empty':
					whereClause = `${tableName}.${field} = ''`;
					break;
				case 'Not Empty':
					whereClause = `${tableName}.${field} != ''`;
					break;
				case 'Equals':
					if(field === "inserted_at"){
						whereClause = `${tableName}.${field} = '${moment.utc(DatePicker1Copy1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					}
					else{
						whereClause = `${tableName}.${field} = '${value}'`;
					}
					break;
				case 'Greater Than':
					whereClause = `${tableName}.${field} > '${moment.utc(DatePicker1Copy1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				case 'Less Than':
					whereClause = `${tableName}.${field} < '${moment.utc(DatePicker1Copy1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				case 'Between':
					whereClause = `${tableName}.${field} BETWEEN       '${moment.utc(DatePicker1Copy1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}' AND '${moment.utc(DatePicker1CopyCopy.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				case 'Greater Than or Equal':
					whereClause = `${tableName}.${field} >= '${moment.utc(DatePicker1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				case 'Less Than or Equal':
					whereClause = `${tableName}.${field} <= '${moment.utc(DatePicker1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				default:
					whereClause = ''; // Default (no filtering)
			}
			return whereClause;
		} catch (error) {
			console.error("Error in applyCondition:", error);
			throw new Error("An error occurred while building the filter condition.");
		}
	},
}
