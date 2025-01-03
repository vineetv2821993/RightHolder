export default {
	async resetPasswordFunction() {
		try {
			// Hash the password using CryptoJS
			const passwordHash = CryptoJS.SHA256(Input16Copy.text).toString();

			// Validation checks
			if (!Input16Copy.text) {
				showAlert("New Password is required", "error");
				return; // Stop execution if the new password is missing
			}

			if (!Input16Copy1.text) {
				showAlert("Confirm Password is required", "error");
				return; // Stop execution if the confirm password is missing
			}

			if (Input16Copy.text !== Input16Copy1.text) {
				showAlert("New and Confirm Password do not match", "error");
				return; // Stop execution if passwords do not match
			}

			// If validations pass, proceed to update the password
			await updateUserPassword.run({
				email: Input16.text,
				password: passwordHash,
				updated_at: moment().format("YYYY-MM-DD HH:mm:ss"), // Current timestamp
			});

			resetWidget("Input16Copy");
			resetWidget("Input16Copy1");

			// Notify the user of success
			showAlert("Password updated successfully!", "success");
			closeModal(Modal9.name)
		} catch (error) {
			// Handle any unexpected errors
			console.error("Error resetting password:", error);
			showAlert("An error occurred while resetting the password. Please try again.", "error");
		}
	},
};
