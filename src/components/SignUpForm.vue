<template>
	<div>
		<div class="auth-container">
			<div class="auth-branding">
				<!-- Include your branding component here -->
				<Authbranding />
			</div>
			<div class="auth-form">
				<v-form v-model="valid" ref="form">
					<v-container>
						<v-row>
							<v-col cols="12">
								<h2 class="auth-heading">SignUp for Ecochain</h2>
							</v-col>
						</v-row>

						<v-col cols="12">
							<label> Organisation Name</label>
							<v-text-field class="rounded-border" placeholder="Enter your organisation name"
								v-model="Organisation_name" v-bind="commonProps" append-inner-icon="mdi-account-outline"
								required></v-text-field>
						</v-col>

						<v-col cols="12">
							<label>Email</label>
							<v-text-field class="rounded-border" v-model="email" :rules="emailRules"
								placeholder="Enter your work email" append-inner-icon="mdi-email-outline"
								v-bind="commonProps" required></v-text-field>
						</v-col>

						<v-col cols="12">
							<label>Password</label>
							<v-text-field class="rounded-border" v-model="password" type="password" :rules="passwordRules"
								placeholder="Enter your password" append-inner-icon="mdi-lock-outline" v-bind="commonProps"
								required></v-text-field>
						</v-col>

						<v-col cols="12">
							<label>Re-type Password</label>
							<v-text-field class="rounded-border" v-model="confirmPassword" type="password"
								:rules="confirmPasswordRules" placeholder="Re-enter your password"
								append-inner-icon="mdi-lock-outline" v-bind="commonProps" required></v-text-field>
						</v-col>

						<v-col cols="12">
							<label>User Type</label>
							<v-radio-group v-model="userType" column>
								<v-radio label="Employee" value="radio-1"></v-radio>
								<v-radio label="Investor" value="radio-2"></v-radio>
							</v-radio-group>
						</v-col>

						<v-row class="mt-3">
							<v-col cols="12">
								<v-btn block @click="submitForm" :disabled="!valid" variant="flat" color="#3056D3"
									class="text-none">
									Create Account
								</v-btn>
								<p class="mt-3" text-align-center>
									Already have an account?
									<router-link to="/">Sign In</router-link>
								</p>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</div>
		</div>
	</div>
</template>


<script>
import Authbranding from './AuthBranding.vue';
import axios from 'axios';
import config from './config';

export default {
	data() {
		return {
			commonProps: {
				variant: 'outlined',
				color: '#3C7931',
				class: 'custom-border',
			},
			userType: null,
			valid: false,
			Organisation_name: '',
			email: '',
			emailRules: [
				value => (value ? true : 'Email is required.'),
				value => /.+@.+\..+/.test(value) ? true : 'Email entered is not valid.',
			],
			password: '',
			confirmPassword: '',
			passwordRules: [
				value => !!value || 'Please type password.',
				value => value.length >= 6 || 'Minimum 6 characters',
			],
		};
	},
	components: {
		Authbranding
	},
	computed: {
		confirmPasswordRules() {
			return [
				value => !!value || 'Please confirm your password',
				value => value === this.password || 'The password confirmation does not match.',
			];
		},
	},
	methods: {
		async submitForm() {
			if (this.valid) {
				console.log('Form is valid, proceed with submission');
				try {
					const response = await axios.post(config.backendApiUrl.concat("/register"), {
						email: this.email,
						password: this.password,
						name: this.Organisation_name
					});

					// Handle the response from the backend here
					console.log('Response from backend:', response.data);

					if (response.data.access_token) {
						localStorage.setItem('access_token', response.data.access_token);
						console.log("Attempting redirect...");
						this.$router.push('/dashboard');
					} else {
						console.error('Register failed:', response.data.message);
					}
				} catch (error) {
					console.error('Error:', error);
					// Handle errors here
				}
			} else {
				console.log('Form is not valid');
			}
		}
	},
};
</script>





  


  
<style scoped>
.auth-container {
	display: grid;
	grid-template-columns: 1.5fr 2fr;
	/* Split the container into two columns */
	gap: 80px;
	/* Gap between branding and form */
	align-items: center;
	height: 100vh;
	/* Optionally, set the height to fill the viewport */
}

/* Style the form component */
.auth-form {
	margin-top: -50px
}

.auth-heading {
  margin-top: 40px;
  text-align: left;
  font-family: 'Abyssinica SIL', sans-serif;


}
</style>
  