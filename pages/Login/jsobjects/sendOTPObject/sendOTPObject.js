export default {
	resendOtp: true,
	isSendOtp: false,
	OTP_EXPIRATION_TIME: 5 * 60 * 1000, // 5 minutes in milliseconds
	generateUUID: function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	showFogetModal(){
		resetWidget("Input14", true);

		resetWidget("Input15", true);
		resetWidget("Input15Copy", true);
		resetWidget("Input15Copy1", true);	
		resetWidget("Input15Copy2", true);
		showModal(Modal8.name);
	},
	// Function to generate OTP
	async generateOtp() {
		try {
			if (!Input14.text) {
				showAlert("Please Enter your email Address to send the Otp For Verification", "error");
				return; // Stop execution if email is not provided
			}
			let rightHolderExits =  await OtpExitsRightHolder.run({email:Input14.text});
			if(rightHolderExits && rightHolderExits.length>0){
				// Generate a random 4-digit OTP

				storeValue("otpRightHolderName",rightHolderExits[0].username);
				const otp = Math.floor(1000 + Math.random() * 9000);

				storeValue("resetStoreValue",otp);
				// Check if OTP already exists for the given email
				const otpData = await getResetOtp.run({ email: Input14.text });

				// Create insert object for a new OTP
				let insertObject = {
					id: this.generateUUID(),
					email: Input14.text,
					otp: otp,
					expiry_at:  moment().add(this.OTP_EXPIRATION_TIME, 'milliseconds').format('YYYY-MM-DD HH:mm:ss'),
					created_at:  moment().format('YYYY-MM-DD HH:mm:ss'),
				};

				// Create update object for existing OTP
				let updateObject = {
					email: Input14.text,
					otp: otp,
					expiry_at:  moment().add(this.OTP_EXPIRATION_TIME, 'milliseconds').format('YYYY-MM-DD HH:mm:ss'),
				};

				if (otpData && otpData.length>0) {
					// If OTP exists, update the OTP and expiration time
					await updateResetOpt.run(updateObject);
					await sendEmailForOtp.run(); // Implement this in Appsmith to send email
					showAlert("OTP updated and email for OTP verification is sent successfully", "success");
				} else {
					// Insert new OTP record
					await InsertRestOtp.run(insertObject);
					storeValue("otpEmail",Input14.text);
					await sendEmailForOtp.run(); // Implement this in Appsmith to send email
					showAlert("Email for OTP verification is sent successfully", "success");
				}


				// Send OTP email (replace with actual email sending function)

				this.isSendOtp = true;
				this.resendOtp = false;
			}
			else{
				showAlert("The email Address you have enter is not exits.", "error");
			}
		} catch (error) {
			console.error("Error in generating OTP:", error);
			showAlert("There was an error generating the OTP. Please try again later.", "error");
		}
	},

	// Function to verify OTP
	async verifyOtp() {
		try {
			let enteredOtp = `${Input15.text}${Input15Copy.text}${Input15Copy1.text}${Input15Copy2.text}`;
			if (
				!Input15.text || !Input15Copy.text || 
				!Input15Copy1.text || !Input15Copy2.text || 
				isNaN(enteredOtp) || enteredOtp.length !== 4 // Assuming OTP length is 4
			) {
				showAlert("Please enter a valid 4-digit OTP in all fields.", "error");
				return; // Stop further execution if inputs are invalid
			}
			// Get OTP data for the provided email address from the database
			const otpData = await getResetOtp.run({ email: Input14.text });

			if (!otpData || (otpData && otpData.length === 0) ) {
				this.resendOtp = true;
				this.isSendOtp= false;
				showAlert("OTP not found. Please request a new one.", "error");
				return; // Stop further execution if no OTP data found
			}
			const expireAt = moment.utc(otpData[0].expiry_at).format('YYYY-MM-DD HH:mm:ss'); 

			// Get the current time in UTC
			const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

			// Debugging logs





			if (`${new Date(currentTime).getTime()}`> `${new Date(expireAt).getTime()}`) {
				await deleteResetOtp.run({ email: Input14.text }); // Optionally, delete expired OTP record
				showAlert("OTP has expired. Please request a new one by clicking on Send OTP again", "error");
				this.resendOtp = true;
				this.isSendOtp= false;
				resetWidget("Input15", true);
				resetWidget("Input15Copy", true);	resetWidget("Input15Copy1", true);	resetWidget("Input15Copy2", true);
				return; // Stop further execution if OTP is expired
			}

			// Check if OTP matches
			if (otpData[0].otp === parseInt(enteredOtp)) {
				showAlert("OTP verified successfully!", "success");
				storeValue("otpEmail",Input14.text);
				await deleteResetOtp.run({ email: Input14.text }); // Delete the OTP after successful verification
				showModal(Modal9.name);
			} else {
				resetWidget("Input15", true);
				resetWidget("Input15Copy", true);
				resetWidget("Input15Copy1", true);	
				resetWidget("Input15Copy2", true);
				this.resendOtp= true;
				showAlert("Please enter the correct OTP, or request a new one if you've not received it.", "error");
			}
		} catch (error) {
			console.error("Error in verifying OTP:", error);
			showAlert("There was an error verifying the OTP. Please try again later.", "error");
		}
	},
	// Close modal and reset OTP state
	async closeModal8() {
		try {
			this.resendOtp = true;
			this.isSendOtp = false;
			resetWidget("Input14", true);
			resetWidget("Input15", true);
			resetWidget("Input15Copy", true);	resetWidget("Input15Copy1", true);	resetWidget("Input15Copy2", true);
			closeModal(Modal8.name);
		} catch (error) {
			resetWidget("Input14", true);
			resetWidget("Input15", true);
			resetWidget("Input15Copy", true);	resetWidget("Input15Copy1", true);	resetWidget("Input15Copy2", true);
			console.error("Error closing modal:", error);
			showAlert("There was an error while closing the modal. Please try again.", "error");
		}
	}
};
