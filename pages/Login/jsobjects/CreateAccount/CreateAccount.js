export default {
	exitQuery:'',
	async checkExpireUser() {
		// Fetch the expire_at value from the database
		let expireDate = await checkExpire.run({id:appsmith.store.rightHolderUserId});
		if (expireDate.length === 0) {

			return false;  // User not found
		}
		const expireAt = moment(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');


		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')


		// Check if the current time is after the expire_at time
		if (moment(currentTime).isAfter(expireAt)) {
			return false;  // Session expired
		}
		return true;  // Session is still valid
	},
	validateData(){
		let isValid=true;
		if(!Input3 || !Input3.text){
			isValid = false;
			showAlert("At least one file needs to be uploaded", "error");
		}	if(!Input4.text){
			isValid = false;
			showAlert("Email Address is required", "error");
		}
		if(!Input6.text){
			isValid = false;
			showAlert("Confirm Email Address is required", "error");
		}
		if(Input6.text && Input6.text !== Input4.text){
			isValid = false;
			showAlert("Email and Confirm Email do not match", "error");
		}
		if(!Input5.text){
			isValid = false;
			showAlert("Confirm Email Address is required", "error");
		}
		return isValid;
	},
	generateUUID: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	creatRightHolderUser: async function() {
		const userId = this.generateUUID(); // Generate a UUID for the new user
		const passwordHash = CryptoJS.SHA256(Input5.text).toString(); // Hash the password
		if(this.validateData()){
			// Prepare the payload for the insert operation
			this.exitQuery = `SELECT id FROM test_taoq_reach.rightHolder WHERE email = '${Input4.text}' or username ='${Input3.text}'`;

			// Run the exit query to check if the user exists
			const result = await ExitRightHolder.run();

			// Check if the result is empty (i.e., the user does not exist)
			if (result.length === 0) {
				// Create the userPayload since the user does not exist
				const userPayload = {
					id: userId,  // Assume userId is defined somewhere in your context
					username: Input3.text,
					password_hash: passwordHash,  // Ensure this is properly hashed
					email: Input4.text,
					expire_at: moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
					inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				};

				// Insert user into the rightHolder table using Appsmith's API or SQL Query
				try {
					const response = await Insert_User.run(userPayload);
					if (response) {
						showAlert('User created successfully!', 'success'); // Show success message
						await closeModal(Modal1.name);			
						await	resetWidget(Modal1.name);
					}
				} catch (err) {
					showAlert('Error creating user: ' + err.message, 'error'); // Show error message
				}
			}
			else{
				showAlert('User already created, try different EmailAddress or userName', 'warning'); // Show success message
				await closeModal(Modal1.name);
				await resetWidget(Modal1.name);
			}
		}
	}
}