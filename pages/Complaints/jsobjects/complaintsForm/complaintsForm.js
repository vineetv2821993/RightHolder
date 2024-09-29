export default {
	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0,
						v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	async submitForm(){
		for(let i=0;i<List1.listData.length;i++){
			let complaint_form_id = this.generateUUID();
			let complaint_status_id = this.generateUUID();
			let complaint_Case_id = await CountComplaintForm.data[0].count + 1;

			try{
				await insertComplaintForm.run(
					{
						complaint_form_id: complaint_form_id,
						complaint_Case_id:Input12.text+ "-" + complaint_Case_id,
						category_type:Select2.selectedOptionLabel,
						acknowledgment: Checkbox1.isChecked,
						original_work: originalWork.text,
						rightHolderUserId: appsmith.store.rightHolderUserId,
						infringing_url: List1.listData[i].input1,
						documentProff: FilePicker1.files[0].data,
						description:List1.listData[i].Description,
						inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
						updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
					}
				);
				await insertComplaintsStatusForm.run(
					{
						complaint_status_id:complaint_status_id,
						complaint_form_id: complaint_form_id,
						status: 'InProgress',
						reason_of_approve_reject: null,
						status_updated_by: null,
						inserted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
						updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
					}
				);
				showAlert("form sucessfully submitted","info");
				closeModal(Modal2.name);
				resetWidget("Select2", true);
				resetWidget("originalWork", true);
				resetWidget("List1", true);

			}
			catch(ex){
				deleteComplaintForm.run({ complaint_form_id: complaint_form_id });
				deleteComplaintsStatusForm.run({ complaint_status_id: complaint_status_id });
				showAlert("error inserting the form,Please try after some time","error");
			}
		}
	}
}
