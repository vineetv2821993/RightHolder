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
			<p>The user <strong>${appsmith.store.signUpRightHolderName}</strong> has submitted new titles for review under their profile. Please find the details of the submission below:</p>
				<ul>
				<li><strong>Right Holder Name:</strong>${appsmith.store.signUpRightHolderName}</li>
					<li><strong>Company Name:</strong> ${appsmith.store.rightHolderInfoCompanyName}</li>
						<li><strong>Email:</strong> ${appsmith.store.signUpRightHolderEmail}</li>
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
				<p>We kindly request your prompt attention to this matter and an update on the status of the titles submitted by <strong>${appsmith.store.signUpRightHolderName}</strong>.</p>
					</div>
			<div class="footer">
				<p>Thank you for your cooperation and support.</p>
			<p>Best regards,</p>
			<p><strong>${appsmith.store.signUpRightHolderName}</strong><br>
			${appsmith.store.rightHolderInfoCompanyName}</p>
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
			if (await this.checkExpireUser()) {
				// Session expired message and redirection to login
				showAlert("Session has expired, please login again", "warning");
				navigateTo('Login', {}, 'SAME_WINDOW');
				return; // Exit the function early
			}

			// Generate UUID for the new record
			const rightHolderUserId = appsmith.store.rightHolderUserId;

			// Iterate through titleList
			for (let i = 0; i < ListTitles.titleList.length; i++) {
				const id = this.generateUUID();
				const titleItem = ListTitles.titleList[i];

				// Check if FilePicker2 exists and has data
				if (!titleItem.FilePicker2 || !titleItem.FilePicker2.length || !titleItem.FilePicker2[0].data) {
					showAlert("Invalid image data format for title: " + titleItem.titleName, "error");
					continue; // Skip to the next title
				}

				// Extract and decode the Base64 data portion from ownershipImage.data
				const base64Data = titleItem.FilePicker2[0].data.split(',')[1];
				if (!base64Data) {
					showAlert("Invalid image data format for title: " + titleItem.titleName, "error");
					continue; // Skip to the next title
				}

				await this.changeFileName();
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
			await sendTitleEmail.run();
			showAlert("Title Addedd Successfully","success");
			showAlert("Email is send to the SAIP Team","success");
			ListTitles.titleList= [
				{ id: 1, titleName: "", FilePicker2: [] } // Start with one empty title entry
			];

			this.resetWidgets();
			closeModal(Modal2Copy.name);
		} catch (error) {
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
				if (title.FilePicker2 && title.FilePicker2[0]) {
					title.FilePicker2[0].name= title.titleName + `.${title.FilePicker2[0].type.split("/")[1]}`;
					title.FilePicker2[0].meta.name = title.titleName+ `.${title.FilePicker2[0].type.split("/")[1]}`;
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
	},
	resetWidgets() {
		resetWidget("input14", true);
		resetWidget("List2", true);
	},
};
