export default {
	async sendEMail() {
		try {
			if (!RichTextEditor1.text) {
				showAlert("You have not raised any query. Please raise at least one query.");
			} else {
				let data = await GetRightHolderInfo.run();

				// Storing necessary values
				await storeValue("rightHolderInfoPhoneNumber", data[0]?.phoneNumber);
				await storeValue("rightHolderInfoCompanyName", data[0]?.company_name);

				// Sending the email
				await sendCustomerSupportEmail.run();

				// Success message
				showAlert("Email sent successfully!",'success');
				showModal(Modal7Copy.name)
				resetWidget('RichTextEditor1');
				resetWidget("FilePicker3");
			}
		} catch (error) {
			// Error handling
			console.error("Error while sending email:", "error");
			showAlert("An error occurred while sending the email. Please try again later.", "error");
		}
	}
}
