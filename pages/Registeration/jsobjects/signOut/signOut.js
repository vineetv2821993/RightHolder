export default {
	// Function to check if the session has expired
	async checkExpireUser() {
		// Fetch the expire_at value from the database based on user ID
		let expireDate = await checkExpire.run({ id: appsmith.store.rightHolderUserId });

		if (expireDate.length === 0) {
			return true;  // User not found
		}

		const expireAt = moment.utc(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');
		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

		// Check if the current time is after the expire_at time
		if (moment(currentTime).isAfter(expireAt)) {
			console.log("Session expired");
			return true;  // Session expired
		}

		console.log("Session still valid");
		return false;  // Session is still valid
	},

	// Sign out function that checks session expiry before logging out
	signOut: async () => {
		// Check if the session has expired
		const isExpired = await this.checkExpireUser();

		if (isExpired) {
			// Session has expired, log out immediately
			navigateTo("Login"); // Redirect to login page
			showAlert("Your session has expired. Please log in again.", "warning");
		} else {
			// Session is still valid, log out normally
			navigateTo("Login"); // Redirect to login page
			showAlert("You have successfully signed out.", "success");
		}
	}
};
