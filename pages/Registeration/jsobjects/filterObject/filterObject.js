export default {
	filterArray : [{
		name:"",
		code:""
	}] ,
	async showFilterArray (type) {
		if (type === 'Inserted Date') {
			this.filterArray = [
				{ name: "Equals", code: "EQUAL" },
				{ name: "Between", code: "BETWEEN" },
				{ name: "Greater Than", code: "GREATER" },
				{ name: "Less Than or Equal", code: "LESS OR Equal" },
				{ name: "Greater Than or Equal", code: "GREATER OR EQUAL" },
				{ name: "Less Than", code: "LESS" },
				{ name: "Empty", code: "EMPTY" },
				{ name: "Not Empty", code: "NOT_EMPTY" },
			];
		} else if (type === 'Case Id' || type === 'Orginal Work / Website' || type === 'Infringing Url' || type === 'Status' || type === 'Status' || type === 'Infringing Url' || type === 'Orginal Work / Website' || type === 'Status' || type === 'Status Updated By' || type === 'Title Name') {
			this.filterArray = [
				{ name: "Equals", code: "EQUAL" },
				{ name: "Contains", code: "CONTAINS" },
				{ name: "Does Not Contain", code: "DOES NOT CONTAIN" },
				{ name: "Starts With", code: "STARTS WITH" },
				{ name: "Ends With", code: "ENDS WITH" },
				{ name: "Is Exactly", code: "IS EXACTLY" },
				{ name: "Empty", code: "EMPTY" },
				{ name: "Not Empty", code: "NOT EMPTY" },
			];
		} else if (type === 'number') {
			this.filterArray = [
				{ name: "Equals", code: "EQUAL" },
				{ name: "Between", code: "BETWEEN" },
				{ name: "Greater Than", code: "GREATER" },
				{ name: "Less Than", code: "LESS" },
				{ name: "Greater Than or Equal", code: "GREATER_OR_EQUAL" },
				{ name: "Less Than or Equal", code: "LESS_OR_EQUAL" },
				{ name: "Not Equals", code: "NOT_EQUAL" },
				{ name: "Empty", code: "EMPTY" },
				{ name: "Not Empty", code: "NOT_EMPTY" },
			];
		}
	}
}