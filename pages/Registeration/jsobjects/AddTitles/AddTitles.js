export default {
	// Existing methods...

	generateEmailTitleTemplate(){
		try{
			let emailTitleTemplate = `<!DOCTYPE html>
				<html lang="en">
					<head>
					<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>Email Template</title>
			<style>
								body {
									font-family: Arial, sans-serif;
									line-height: 1.6;
									color: #333;
									margin: 0;
									padding: 0;
									background-color: #f4f4f4;
								}
			.container {
				max-width: 600px;
				margin: 20px auto;
				padding: 20px;
				background: #fff;
				border-radius: 8px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}
			.header {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 10px;
				color: #007BFF;
			}
			.content {
				margin-bottom: 20px;
			}
			.content p {
				margin: 10px 0;
			}
			.content ul {
				list-style: none;
				padding: 0;
			}
			.content ul li {
				margin: 5px 0;
				font-size: 14px;
			}
			.footer {
				font-size: 14px;
				margin-top: 20px;
				color: #555;
			}
			.footer p {
				margin: 5px 0;
			}
			a {
				color: #007BFF;
				text-decoration: none;
			}
			a:hover {
				text-decoration: underline;
			}
			.title-list {
				margin-top: 10px;
				padding-left: 10px;
				border-left: 3px solid #007BFF;
			}
			.title-list li {
				margin: 8px 0;
			}
			</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						Request for Title Verification
							</div>
			<div class="content">
				<p>Dear Online Antipiracy Team,</p>
			<p>The user <strong>${HolderName.text}</strong> has submitted new titles for review under their profile. Please find the details of the submission below:</p>
				<ul>
				<li><strong>Right Holder Name:</strong> ${HolderName.text}</li>
					<li><strong>Company Name:</strong> ${CompanyName.text}</li>
						<li><strong>Email:</strong> ${EmailAddress.text}</li>
								</ul>
			<p><strong>Submitted Titles:</strong></p>
				<ul class="title-list">
					${ListTitles.titleList.map(
						(title) => `
                    <li>
                        <strong>Title:</strong> ${title.titleName}<br>
                    </li>`
					).join('')}
			</ul>
       <p>Please find the attachment corresponding to each title below. The name of the attachment matches the title name, so you can easily identify which attachment corresponds to each title:</p>

			<p>For your convenience, please use the link below to access the Dashboard and provide the approval or rejection status for the submitted titles:</p>
			<p><a href="https://saip.bytes.care/app/saip-test/dashboard-66fe3a8daf2b8e5a2a63fc02?branch=master" target="_blank">Access the SAIP Dashboard</a></p>
				<p>We kindly request your prompt attention to this matter and an update on the status of the titles submitted by <strong>${HolderName.text}</strong>.</p>
					</div>
			<div class="footer">
				<p>Thank you for your cooperation and support.</p>
			<p>Best regards,</p>
			<p><strong>${Name.text}</strong><br>
			${CompanyName.text}</p>
			</div>
			</div>
			</body>
			</html>`;
			return emailTitleTemplate;
		}
		catch(ex)
		{
			throw ex;
		}
	},

	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	async checkExpireUser() {
		// Fetch the expire_at value from the database
		let expireDate = await checkExpire.run({ id: appsmith.store.rightHolderUserId });
		if (expireDate.length === 0) {
			return true; // User not found
		}
		const expireAt = moment(expireDate[0].expire_at).format('YYYY-MM-DD HH:mm:ss');
		const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
		// Check if the current time is after the expire_at time
		return moment(currentTime).isAfter(expireAt); // Returns true if session expired
	},

	async addTitles() {
		try {
			// Generate UUID for the new record
			const rightHolderUserId = appsmith.store.rightHolderUserId;

			// Iterate through titleList
			for (let i = 0; i < ListTitles.titleList.length; i++) {
				const id = this.generateUUID();
				const titleItem = ListTitles.titleList[i];
				console.log("titleItem",titleItem);

				// Extract and decode the Base64 data portion from ownershipImage.data
				const base64Data = titleItem.FilePicker2Copy[0].data.split(',')[1];
				if (!base64Data) {
					showAlert("Invalid image data format for title: " + titleItem.titleName, "error");
					continue; // Skip to the next title
				}
				// Insert the record into the database
				await insertComplaintTiles.run({
					id: id,
					name: titleItem.titleName,
					ownershipImage: base64Data, // Keep it as is
					rightHolderUserId: rightHolderUserId,
					inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				});
			}
			showAlert("Complaint title(s) added successfully!", "success");
			resetWidget("List2",true);
			resetWidget("Checkbox1",true);
			closeModal(Modal2.name);
			await this.changeFileName();
			await sendTitleEmail.run();
			showAlert("Email is send to the SAIP Team","success");
			// closeModal(Modal2Copy.name);

		} catch (error) {
			resetWidget("List2",true);
			resetWidget("Checkbox1",true);
			console.error("Error during addTitles:", error);
			showAlert("Failed to add complaint title: " + error.message, "error");
		}
	},
	async changeFileName(){
		try{
			ListTitles.titleList.forEach((title) => {
				// Log the titleName and associated file name for debugging
				console.log(`Processing Title: ${title.titleName}`);

				// Check if FilePicker2Copy exists and contains a file
				if (title.FilePicker2Copy && title.FilePicker2Copy[0]) {
					title.FilePicker2Copy[0].name= title.titleName + `.${title.FilePicker2Copy[0].type.split("/")[1]}`;
					title.FilePicker2Copy[0].meta.name = title.titleName+ `.${title.FilePicker2Copy[0].type.split("/")[1]}`;
				} else {
					// Log if there is no file in FilePicker2Copy
					console.log("No file found in FilePicker2Copy.");
				}
			});
			return;
		}
		catch(ex)
		{
			throw ex;
		}
	}
};
