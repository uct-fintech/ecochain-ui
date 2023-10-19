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
								<h2 class="auth-heading">Register Your Organisation</h2>
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

						<v-row class="mt-3">
							<v-col cols="12">
								<v-btn block @click="submitForm" :disabled="!valid" variant="flat" color="#3056D3"
									class="text-none">
									Create Organisation
								</v-btn>
								<v-col cols="12" v-for="(error, index) in errors" :key="index">
                                <v-alert type="error" dense>
                                    {{ error }}
                                </v-alert>
                            </v-col>
							<p class="mt-3" style="text-align: center;">
									Already registered your org?
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
			errors: [],
			commonProps: {
				variant: 'outlined',
				color: '#3C7931',
				class: 'custom-border',
			},
			userType: null,
			valid: false,
			OrganisationName: '',
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
            this.errors = [];  

            if (this.valid) {
                console.log('Form is valid, proceed with submission');
                try {
                    const response = await axios.post(config.backendApiUrl.concat("/register"), {
                        email: this.email,
                        password: this.password,
                        name: this.Organisation_name
                    });

                    console.log('Response from backend:*********', response.data);

                    if (response.data.success) {
						localStorage.setItem('access_token', response.data.access_token);
                        console.log("Attempting redirect...")
                        this.$router.push('/organisation_form');
                    } else {
                        console.error('Register failed:', response.data.message);
                        this.errors.push(response.data.message || "An error occurred during registration.");
                    }
                } catch (error) {
                    if (error.response) {
                        if (error.response.data && error.response.data.message) {
                            this.errors.push(error.response.data.message);
                        } else {
                            if (error.response.status === 400) {
                                this.errors.push("Invalid input. Please check your data and try again.");
                            } else if (error.response.status === 409) {
                                this.errors.push("Email already exists. Please use another one.");
                            } else {
                                this.errors.push("An error occurred while processing your request. Please try again later.");
                            }
                        }
                    } else {
                        this.errors.push("Network error. Please check your connection and try again.");
                    }
                }
            } else {
                this.errors.push("Please ensure all fields are filled out correctly.");
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
  