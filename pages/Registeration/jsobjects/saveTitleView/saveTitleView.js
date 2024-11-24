export default {
	async Image5onClick (data) {
		//	write code here
		console.log(data);
		await storeValue("TitleImagePreivew",data);
		showModal(Modal7.name);
	}
}