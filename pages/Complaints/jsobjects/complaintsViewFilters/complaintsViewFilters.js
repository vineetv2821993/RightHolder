export default {
	whereFilter: "",
	async filtersObject() {
		try {
			let where = await this.applyCondition(
				Select4.selectedOptionValue,
				Select4Copy.selectedOptionLabel,
				Input16.text
			);
			console.log("where", where);

			this.whereFilter = ` and ${where}`;
			await countViewComplaintStatus.run();
			await GetViewComplaintStatus.run();
			closeModal(Modal15.name);
			// resetWidget("Select4", true);
			// resetWidget("Select4Copy", true);
			// resetWidget("Input16", true);
		} catch (error) {
			console.error("Error in filtersObject:", error);
			showAlert("Failed to apply filters. Please try again.", "error");
		}
	},
	async clearFilter() {
		try {
			this.whereFilter = "";
			await countViewComplaintStatus.run();
			await GetViewComplaintStatus.run();
			resetWidget("Select4", true);
			resetWidget("Select4Copy", true);
			resetWidget("Input16", true);
		} catch (error) {
			console.error("Error in clearFilter:", error);
			showAlert("Failed to clear filters. Please try again.", "error");
		}
	},
	async applyCondition(field, condition, value) {
		try {
			let whereClause;
			let tableName="complaints_form";
			if(field === "Status" ||  field === "StatusUpdatedBy"){
				tableName = "complaint_status";
			}
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
						whereClause = `${tableName}.${field} = '${moment.utc(DatePicker1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					}
					else{
						whereClause = `${tableName}.${field} = '${value}'`;
					}
					break;
				case 'Greater Than':
					whereClause = `${tableName}.${field} > '${moment.utc(DatePicker1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				case 'Less Than':
					whereClause = `${tableName}.${field} < '${moment.utc(DatePicker1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
					break;
				case 'Between':
					whereClause = `${tableName}.${field} BETWEEN       '${moment.utc(DatePicker1.formattedDate).format('YYYY-MM-DD HH:mm:ss')}' AND '${moment.utc(DatePicker1Copy.formattedDate).format('YYYY-MM-DD HH:mm:ss')}'`;
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
};
