export default {
	async imageRendering(images) {
		await storeValue("currentImages1", images); 
		showModal(Modal6.name);
	},

	async convertToBase64() {
		try {
			// Run the query to fetch the image data
			const result = await getComplaintsTitles.run();

			// Check if data was retrieved
			if (!result || !result[0] || !result[0].ownershipImage) {
				showAlert("No image data found.", "error");
				return;
			}

			// Convert the binary data (BLOB) to a Base64 string
			const binaryData = result[0].ownershipImage; // Assuming this is a Buffer
			const base64String = buffer.Buffer.from(binaryData).toString('base64'); // Convert to Base64

			// Construct a data URI
			const imageSrc = `data:image/png;base64,${base64String}`; // Change the MIME type if needed

			// Store the Base64 string in Appsmith's store
			await storeValue("imageSrc", imageSrc); 

			return imageSrc; // Return the image source
		} catch (error) {
			console.error("Error converting image to Base64:", error);
			showAlert("Failed to convert image to Base64: " + error.message, "error");
		}
	}
};
