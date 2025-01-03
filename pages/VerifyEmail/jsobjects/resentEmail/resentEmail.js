export default {
	generateUUID: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	async resentEmailDetails() {
		try {			
			let rightHolderUserName = await getRightHolder.run({id:appsmith.store.rightHolderUserId});
			await storeValue("signUpRightHolderName",rightHolderUserName[0].username);
			const verificationExpires = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

			const token = appsmith.URL.queryParams.token;

			const verificationEntry = await getVerificationEntry.run({ token: token });
			const verificationToken = this.generateUUID(); 
			await storeValue("emailVerifyToken",verificationToken);
			if(verificationEntry && verificationEntry.length>0){
				await updateVerifyToken.run({
					user_id: appsmith.store.rightHolderUserId,
					token: verificationToken
				});
			}
			else{
				const verifyId = this.generateUUID(); 
				const tokenPayload = {
					id: verifyId,
					user_id: appsmith.store.rightHolderUserId,
					token: verificationToken,
					expire_at: verificationExpires
				};
				await Insert_Verification_Token.run(tokenPayload);
			}
			await verifyEmail.run(); // Run the email verification function
			closeModal(ExpireModal.name);
			showModal(VerifyEmailModal.name);

		} catch (error) {
			showAlert('Failed to send verification email. Please try again later.', 'error'); // Error message
			console.error("Error sending verification email:", error);
		}
	}
}