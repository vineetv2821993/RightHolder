export default {
	signInQuery: '',
	async signInRightHolder() {
		if(!Input1.text){
			showAlert("Email Address  or User Name is required", "error");
		}
		else if(!Input2.text){
			showAlert("Password is required", "error");
		}
		else{
			const hashedPassword = CryptoJS.SHA256(Input2.text).toString(); // Use the same hash method as used for registration

			this.signInQuery = `
    SELECT id, username, email
    FROM taoq_research.rightHolder
    WHERE (email = '${Input1.text}' OR username = '${Input1.text}')
    AND password_hash = '${hashedPassword}'
`;
			console.log(	this.signInQuery );
			let data = await signInRightHolder.run();
			if(data && data.length >0){
				let checkData = await checkRightHolderInfoExit.run({id:data[0].id});
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
				showAlert("invalid username or emailaddress and password","error");
			}
		}

	}
}