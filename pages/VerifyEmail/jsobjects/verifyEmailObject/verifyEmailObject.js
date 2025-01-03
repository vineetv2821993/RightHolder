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
			let currentTime= moment().format('YYYY-MM-DD HH:mm:ss');
			const expireAt = moment.utc(expire_at).format('YYYY-MM-DD HH:mm:ss'); 
			console.log("asdada",currentTime,expireAt);
			if (`${new Date(currentTime).getTime()}`< `${new Date(expireAt).getTime()}`) {
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
				}, 15000); // 10 seconds
			} else {
				// Token expired
				await deleteVerificationEntry.run({ token: token });
				showModal(ExpireModal.name);
			}
		} else {
			let data = await getRightHolder.run({ id: appsmith.store.rightHolderUserId });
			console.log("dirext login",data)
			if (data[0].email_verified) {
				showModal(Modal1Copy.name);
				this.loginTimeout = setTimeout(() => {
					navigateTo('Login', {}, 'SAME_WINDOW');
				}, 15000); // 10 seconds
			}
			else
			{
				showModal(Modal1CopyCopy.name);
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
