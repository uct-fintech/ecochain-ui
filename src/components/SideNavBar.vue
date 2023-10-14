<template>
	<div class="wrapper">
		<div class="side-nav-bar">
			<div class="nav-logo">
				<v-img src="@/assets/logo.png" alt="Company Logo" class="company-logo"
					style="margin: 1rem 0 2rem 0;"></v-img>
			</div>
			<div class="nav-items" style="">
				<ul>
					<li v-for="item in menuItems" :key="item.label">
						<a :href="item.link" @click.prevent="handleMenuClick(item)">
							{{ item.label }}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
  
<script>
import axios from 'axios';
import config from './config';

export default {
	name: 'SideNavBar',
	data() {
		return {
			menuItems: [
				{ label: 'Dashboard', link: '/dashboard' },
				{ label: 'Create New Report', link: '/CreateNewReport', action: this.newReport },
				{ label: 'Log Out', link: '/', action: this.logout }

			]
		};
	},
	methods: {
		logout() {
			// Assuming you have an endpoint like '/logout' to handle logouts on your backend
			axios.post(config.backendApiUrl.concat("/logout"))
				.then(response => {
					if (response.status === 200) {
						this.$router.push('/'); // redirect to home page or login page
					}
				})
				.catch(error => {
					console.error('Error logging out:', error);
				});
		},
		handleMenuClick(menuItem) {
			if (menuItem.action) {
				menuItem.action();
			} else {
				this.$router.push(menuItem.link);
			}
		},

		async newReport() {
			try {
				const token = localStorage.getItem('access_token');
				const headers = {
					'Authorization': 'Bearer ' + token
				};

				const response = await axios.get(config.backendApiUrl.concat("/start_submission"), { headers: headers });
				console.log('Response from backend:', response.data);
				const submissionId = response.data.submission_id;
				this.$router.push({ name: 'CreateNewReport', params: { id: submissionId } });
			} catch (error) {
				console.error("Error fetching data:", error);
				// handle the error, e.g., show a user-friendly message or retry the request
			}
		}
	}
};
</script>
  
<style scoped>
/* Wrapper styles */
.wrapper {
	display: flex;
	flex: 0 0 200px;
	/* flex-grow, flex-shrink, flex-basis */
	height: 100vh;
	/* 100% of the viewport height */
}

/* SideNavBar styles */
.side-nav-bar {
	width: 100%;
	background-color: #1C2434;
	color: #ffffff;
	padding: 10px;
	border-right: 1px solid #ccc;
	height: 100%;
	/* Full height of the wrapper */
}

.side-nav-bar ul {
	list-style-type: none;
	padding: 0;
	margin: 0;
	/* Reset margin */
	height: 100%;
	display: flex;
	flex-direction: column;
}

.side-nav-bar li {
	/* left justify text */
	text-align: left;
	margin: 10px 0;
	/* apply padding to center text in the bar */
	padding-left: 25px;
}

.side-nav-bar a {
	color: #ffffff;
	text-decoration: none;
}

.side-nav-bar a:hover {
	text-decoration: underline;
}

/* Main content styles */
.main-content {
	flex: 1;
	/* Take up the remaining space */
	padding: 10px;
	overflow-y: auto;
	/* Add scroll if content overflows */
}

.title {
	color: #ffffff;
	text-align: left;
	margin: 10px 0;
	/* apply padding to center text in the bar */
	padding-left: 25px;
}
</style>
  