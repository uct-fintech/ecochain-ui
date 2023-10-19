<template>
	<div>

		<v-container>

			<v-table>
				<thead>
					<tr>
						<td colspan="4">
							<h1>{{ name }}</h1>
						</td>

					</tr>
				</thead>

				<tbody>
					<tr>
						<td><b>Location</b></td>
						<td>{{ location }}</td>
						<td><b>Industry</b></td>
						<td>{{ industry }}</td>
					</tr>
					<tr>
						<td><b>Size</b></td>
						<td>{{ size }}</td>

						<td><b>Description</b></td>
						<td>{{ description }}</td>
					</tr>
				</tbody>
			</v-table>

		</v-container>
		<v-container>

			<v-table>
				<thead style="margin: 1rem 0rem 1rem 0rem;">
					<tr>
						<td colspan="5">
							<h1>ESG Reports</h1>
						</td>
						<td style="text-align: right;">
							<v-btn color="#219653" size="small" @click="createNewReport">
								New Report
							</v-btn>
						</td>
					</tr>


				</thead>
			</v-table>
			<v-table>
				<tbody style="text-align: center;">
					<tr style="font-size: smaller;">
						<td>Submission ID</td>
						<td>Year</td>
						<td>Submitter</td>
						<td>Submission Date</td>
						<td>Status</td>
						<td></td>
					</tr>
					<tr v-for="submission in submissions" :key="submission.SubmissionID">
						<td>{{ submission.SubmissionID }}</td>
						<td>{{ submission.Year }}</td>
						<td>{{ submission.FirstName }} {{ submission.LastName }}</td>
						<td>{{ new Date(submission.Date).toLocaleDateString() }}</td>
						<td>{{ getStatusText(submission.Status) }}</td>
						<td>
							<v-btn v-if="submission.Status === 0" color="green"
								@click="goToCreateNewReport(submission.SubmissionID)">
								Continue
							</v-btn>
							<v-btn v-else color="blue" @click="goToSuccessPage(submission.SubmissionID)">
								View Details
							</v-btn>
						</td>
					</tr>
				</tbody>
			</v-table>



		</v-container>
	</div>
</template>
  
<script>
import axios from 'axios';
import config from './config';

export default {
	name: 'DashboardPage',
	data() {
		return {
			name: '',
			email: '',
			algo_add: '',
			location: '',
			industry: '',
			size: '',
			description: '',
			submissions: []
		}
	},
	mounted() {
		this.fetchDashboardData();
	},
	methods: {
		goToCreateNewReport(submissionID) {
			console.log(submissionID)
			this.$router.push({ name: 'CreateNewReport', query: { submissionID } });
		},
		goToSuccessPage(submissionID) {
			console.log(submissionID)
			this.$router.push({ name: 'SuccessPage', query: { submissionID } });
		},
		async fetchDashboardData() {
			try {
				const token = localStorage.getItem('access_token');
				const headers = {
					'Authorization': 'Bearer ' + token
				};

				const response = await axios.get(config.backendApiUrl.concat("/get_dashboard"), { headers: headers });

				if (response.data.success) {
					this.name = response.data.name;
					this.email = response.data.email;
					this.algo_add = response.data.algo_add;
					this.submissions = response.data.submissions;
					this.location = response.data.location;
					this.industry = response.data.industry;
					this.size = response.data.size;
					this.description = response.data.description;
				} else {
					console.error('Error fetching dashboard data');
				}
			} catch (error) {
				console.error('There was an error fetching the data', error);
			}
		},
		async createNewReport() {
			const token = localStorage.getItem('access_token');
			const headers = {
				'Authorization': 'Bearer ' + token
			};

			const response = await axios.get(config.backendApiUrl.concat("/start_submission"), { headers: headers });
			if (response.data.success) {
				const SubmissionID = response.data.submission_id;
				this.$router.push({ name: 'CreateNewReport', query: { submissionID: SubmissionID } });
			}
		},


		getStatusText(status) {
			switch (status) {
				case 0: return 'In Progress';
				case 1: return 'Complete';
				case 2: return 'Rejected';
				default: return 'Unknown';
			}
		}
	}
}

</script>
  
<style scoped></style>
  