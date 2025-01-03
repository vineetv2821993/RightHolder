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
			const verificationExpires = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

			const verificationToken = this.generateUUID(); 
			const verifyId = this.generateUUID(); 

			let exitsAccessToken= await checkAccessTokenExits.run({user_id: appsmith.store.rightHolderUserId});

			if(exitsAccessToken && exitsAccessToken.length >0){

				await updateVerifyToken.run({
					user_id: appsmith.store.rightHolderUserId,
					token: verificationToken
				});
			}
			else
			{

				const tokenPayload = {
					id: verifyId,
					user_id: appsmith.store.rightHolderUserId,
					token: verificationToken,
					expire_at: verificationExpires
				};
				await Insert_Verification_Token.run(tokenPayload);
			}
			await verifyEmail.run(); // Run the email verification function
			closeModal(Modal7Copy.name);
			showModal(Modal7.name);
			showAlert("We have resend verify email to your email address","success");

		} catch (error) {
			showAlert('Failed to send verification email. Please try again later.', 'error'); // Error message
			console.error("Error sending verification email:", error);
		}
	}
}