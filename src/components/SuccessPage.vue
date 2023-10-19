<template>
  <v-container class="auth-container">
    <v-row>
      <!-- Image on the left -->
      <v-col>
        <v-img src="@/assets/successphoto.png" alt="Success Photo" class="success-photo"></v-img>
      </v-col>

      <!-- Content on the right -->
      <v-col>
        <h2 style="margin-bottom: 20px;">Submission Successful!</h2>

        <p style="margin-bottom: 20px;">Your submission has successfully been submitted and stored on the Blockchain. A
          summary email has been sent as reference for the report and an NFT has been minted as certification.</p>

        <div style="margin-bottom: 20px;"><strong>NFT TXID:</strong> {{ nft_id }}</div>
        <div style="margin-bottom: 20px;"><strong>Report TXID:</strong> {{ transaction_id }}</div>


        <v-row class="mt-3">
          <v-col cols="6">
            <a href="https://testnet.algoexplorer.io/tx/{{transaction_id}}" target="_blank" style="text-decoration: none;">
              <v-btn block color="#219653" class="text-none" variant="outlined">
                View Submission
              </v-btn>
            </a>


          </v-col>
          <v-col cols="6">
            <a href = "https://testnet.algoexplorer.io/asset/{{nft_id}}"  target="_blank" style="text-decoration: none;">
            <v-btn block color="#219653" class="text-none" variant="outlined">
              View NFT
            </v-btn>
            </a>
          </v-col>
        </v-row>
        <v-row align="right" justify="center">
          <v-col cols="6">
            <v-btn block color="#219653" class="text-none" @click="dashboardPage">
              Done
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import config from './config';


export default {
  name: 'SuccessPage',
  data() {
    return {
      transaction_id: '',
      nft_id: ''
    }
  },
  mounted() {
    this.fetchTransactionData();
  },
  methods: {
    async fetchTransactionData() {
			try {
				const token = localStorage.getItem('access_token');
				const headers = {
					'Authorization': 'Bearer ' + token
				};

				const response = await axios.get(config.backendApiUrl.concat("/get_success_page"), { headers: headers });

				if (response.data.success) {
					this.transaction_id = response.data.transaction_id;
					this.nft_id = response.data.nft_id;
				} else {
					console.error('Error fetching transaction data');
				}
			} catch (error) {
				console.error('There was an error fetching the data', error);
			}
		},
    dashboardPage() {
      this.$router.push('/dashboard');
    }
  }
}
</script>


<style scoped>
.auth-container {
  display: grid;

  gap: 10px;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.success-photo {
  width: 500px;
  height: 500px;
  position: center
}
</style>
