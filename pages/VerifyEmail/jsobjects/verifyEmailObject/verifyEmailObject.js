export default {
	rightHolderData: "",
	loginTimeout: null,

	async verifyEmail() {
		// Check if the token exists and is valid
		const token = appsmith.URL.queryParams.token;
		console.log("token", token);

		// Retrieve the 'token' parameter from the URL
		const verificationEntry = await getVerificationEntry.run({ token: token });
		console.log("verificationEntry", verificationEntry);

		if (verificationEntry.length > 0) {
			const { rightHolder_id, expire_at } = verificationEntry[0];
			console.log("expire_at", expire_at, rightHolder_id);
			this.rightHolderData = (await getRightHolder.run({ id: rightHolder_id }))[0];

			// Check if the token has expired
			if (moment().isBefore(expire_at)) {
				console.log("user_id", rightHolder_id, rightHolder_id);

				// Update the user record to mark the email as verified
				await updateUserEmailVerified.run({ id: rightHolder_id });
				showModal(Modal1.name);
				// Delete the verification entry
				console.log("token", token);
				await deleteVerificationEntry.run({ token: token });

				// Set a timeout to automatically navigate to the login page after 30 seconds
				this.loginTimeout = setTimeout(() => {
					navigateTo('Login', {}, 'SAME_WINDOW');
				}, 30000); // 30 seconds
			} else {
				// Token expired
				await deleteVerificationEntry.run({ token: token });
				showModal(ExpireModal.name);
			}
		} else {
			let data = await getRightHolder.run({ id: appsmith.store.rightHolderUserId });
			if (data[0].email_verified) {
				showModal(Modal1Copy.name);
				this.loginTimeout = setTimeout(() => {
					navigateTo('Login', {}, 'SAME_WINDOW');
				}, 30000); // 30 seconds
			}
		}
	},

	// Call this function when the login button is clicked
	cancelAutoNavigate() {
		if (this.loginTimeout) {
			clearTimeout(this.loginTimeout);
		}
		navigateTo('Login', {}, 'SAME_WINDOW');
	}
}
