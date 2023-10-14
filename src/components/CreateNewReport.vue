<template>
	<div class="form-wizard-outer">

		<h1 text: center> ESG Submission {{ localSubmissionId }}</h1>
		<br>
		<br>
		<FormWizard @on-complete="onComplete" color="#219653" step-size="xs" back-button-text="Back to previous section"
			next-button-text="Next section" finish-button-text="Submit">

			<div class="form-wizard-container">
				<TabContent title="Submission Info" icon="ti-wallet" text-center>
					<BackgroundInfo />
				</TabContent>
				<TabContent title="People" icon="ti-user">
					<PeoplePage />
				</TabContent>
				<TabContent title="Governance" icon="ti-shield">
					<GovernancePage />
				</TabContent>
				<TabContent title="Planet" icon="ti-world">
					<PlanetPage />
				</TabContent>
				<TabContent title="Prosperity" icon="ti-wallet">
					<ProsperityPage />
				</TabContent>

				<TabContent title="Review and Submit" icon="ti-check-box">
					<ReviewSubmitPage />
				</TabContent>
			</div>
		</FormWizard>
	</div>
</template>


<script>
// Local registration
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
import BackgroundInfo from './BackgroundInfo.vue';
import PeoplePage from './PeoplePage.vue';
import GovernancePage from './GovernancePage.vue';
import PlanetPage from './PlanetPage.vue';
import ProsperityPage from './ProsperityPage.vue';
import ReviewSubmitPage from './ReviewSubmit.vue';

export default {
	name: 'CreateNewReport',
	data() {
		return {
			localSubmissionId: null, // to store the submissionId in this component's data
		};
	},
	mounted() {
		// access the id from the route params and store it in localSubmissionId
		this.localSubmissionId = this.$route.params.id;
	},
	components: {
		FormWizard,
		TabContent,
		BackgroundInfo,
		PeoplePage,
		GovernancePage,
		PlanetPage,
		ProsperityPage,
		ReviewSubmitPage
	},
	methods: {

		onComplete() {
			this.$router.push({ name: 'SuccessPage' }); // Using named route
			// or
			// this.$router.push('/SuccessPage'); // Using path directly
		},
	},

};
</script>

<style>
@import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");

.form-wizard-container {
	background-color: white;
	padding: 20px 30px 20px 40px;
	margin: 10px 10px;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

	overflow: auto;
}

.form-wizard-outer {
	padding: 50px;
}
</style>
