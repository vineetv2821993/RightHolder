export default {
	exitQuery:'',
	signInQuery: '',
	async checkExpireUser(loginId) {
		// Fetch the expire_at value from the database
		let expireDate = await checkExpire.run({id:loginId});
		if (expireDate.length === 0) {

			return true;  // User not found
		}
		const expireAt = moment(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');


		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')


		// Check if the current time is after the expire_at time
		if (moment(currentTime).isAfter(expireAt)) {
			return true;  // Session expired
		}
		return false;  // Session is still valid
	},
	async signInRightHolder() {
		if(!Input1.text){
			showAlert("Email Address  or User Name is required", "error");
		}
		else if(!Input2.text){
			showAlert("Password is required", "error");
		}
		else{
			this.exitQuery = `SELECT id FROM taoq_research.rightHolder WHERE email = '${Input1.text}' or username ='${Input1.text}'`;

			// Run the exit query to check if the user exists
			const result = await ExitRightHolder.run();
			if (result.length > 0) {
				const hashedPassword = CryptoJS.SHA256(Input2.text).toString(); // Use the same hash method as used for registration

				this.signInQuery = `
    SELECT id, username, email
    FROM taoq_research.rightHolder
    WHERE (email = '${Input1.text}')
    AND password_hash = '${hashedPassword}'
`;
				console.log(	this.signInQuery );
				let data = await signInRightHolder.run();
				if(data && data.length >0){
					let checkData = await checkRightHolderInfoExit.run({id:data[0].id});
					let isExpire = await this.checkExpireUser(data[0].id);
					if(!isExpire){
						await updateExpireDate.run({id:data[0].id});
					}
					if(checkData && checkData.length>0){
						navigateTo('Complaints', {}, 'SAME_WINDOW');
					}
					else{
						navigateTo('Registeration', {}, 'SAME_WINDOW');
					}
					storeValue("rightHolderUserId",data[0].id);
					showAlert("login successfully","info");
				}

				else
				{
					showAlert("invalid username or email Address and password","error");
				}
			}
			else{
				showAlert("Email Address not found, please create the account","warning");
			}
		}


	}
}