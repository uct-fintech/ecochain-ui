<template>
  <div class="form-wizard-outer">
    <h1 text: center> ESG Submission </h1>
    <br>
    <br>
    <FormWizard @on-complete="onComplete" @on-change="(...args) => beforeChange(...args)" color="#219653" step-size="xs"
      back-button-text="Back to previous section" next-button-text="Next section" finish-button-text="Submit">

      <div class="form-wizard-container">
        <TabContent title="Submission Info" icon="ti-wallet" text-center>
          <BackgroundInfo @updateData="updateData" />
        </TabContent>
        <TabContent title="People" icon="ti-user">
          <PeoplePage ref="PeoplePage" @updateMetrics="handleMetricsUpdate" />
        </TabContent>
        <TabContent title="Governance" icon="ti-shield">
          <GovernancePage ref="GovernancePage" @updateGovernanceMetrics="updateGovernanceMetrics" />
        </TabContent>
        <TabContent title="Planet" icon="ti-world">
          <PlanetPage ref="PlanetPage" @updatePlanetMetrics="updatePlanetMetrics" />
        </TabContent>
        <TabContent title="Prosperity" icon="ti-wallet">
          <ProsperityPage ref="ProsperityPage" @updateProsperityMetrics="updateProsperityMetrics" />
        </TabContent>
        <TabContent title="Review and Submit" icon="ti-check-box">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <td colspan="4">
                  <h1>Submission Information</h1>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="review-cell">Company</td>
                <td class="review-cell">{{ company }}</td>
                <td class="review-cell">Submitted by</td>
                <td class="review-cell">{{ full_name }}</td>
              </tr>
              <tr>
                <td class="review-cell">Submission Period</td>
                <td colspan="3" class="review-cell">{{ formattedPeriod }}</td>
              </tr>
              <tr>
                <td colspan="4"><br>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tbody>
                      <tr>
                        <td class="review-cell">Sections included in Submission</td>
                        <td class="review-cell"></td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td class="review-cell">People</td>
                        <td class="review-cell">
                          <div class="status-cell" :style="getCellStyle(getSectionStatus('PeoplePage'))">
                            {{ getSectionStatus('PeoplePage') }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td class="review-cell">Planet</td>
                        <td class="review-cell">
                          <div class="status-cell" :style="getCellStyle(getSectionStatus('PlanetPage'))">{{
                            getSectionStatus('PlanetPage') }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td class="review-cell">Prosperity</td>
                        <td class="review-cell">
                          <div class="status-cell" :style="getCellStyle(getSectionStatus('ProsperityPage'))">{{
                            getSectionStatus('ProsperityPage') }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td class="review-cell">Governance</td>
                        <td class="review-cell">
                          <div class="status-cell" :style="getCellStyle(getSectionStatus('GovernancePage'))">{{
                            getSectionStatus('GovernancePage') }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table><br>

          <v-checkbox v-model="checkbox" color="#219653">
            <template v-slot:label>
              <div>
                By checking this box, I confirm that all metrics provided are accurate. I accept responsibility for any
                audit discrepancies. Upon submission, an email will be sent, the data will be blockchain-recorded, and an
                NFT will be minted. All actions are final and irreversible.
              </div>
            </template>
          </v-checkbox>

        </TabContent>
      </div>
    </FormWizard>
  </div>


  <v-dialog v-model="dialogVisible" max-width="700px">
    <v-card>
      <v-card-title class="mb-4">
        <span class="text-h5">Please tick the checkbox</span>
      </v-card-title>

      <v-card-text class="mb-4">
        Please check the box before continuing
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#219653" text @click="dialogVisible = false">Okay</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <button @click="onSubmitButtonClick">Submit</button>
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
import axios from 'axios';
import config from './config';

export default {
  components: {
    FormWizard,
    TabContent,
    BackgroundInfo,
    PeoplePage,
    GovernancePage,
    PlanetPage,
    ProsperityPage
  },

  data() {

    return {
      company: '',
      full_name: '',
      start_period: null,
      end_period: null,
      diversityInclusion: '',
      payEquality: '',
      wageLevel: '',
      healthSafetyLevel: '',
      dialogVisible: false,
      checkbox: false,
      firstName: '',
      lastName: '',
      startDate: '',
      endDate: '',
      ethicalBehaviorTraining: '',
      previousYearCorruptionIncidents: '',
      currentYearCorruptionIncidents: '',
      greenhouseGasEmissions: '',
      tcfdImplementation: '',
      waterConsumptionInStressedAreas: '',
      landUseEcologicalSensitivity: '',
      totalTaxPaid: '',
      newEmployees: '',
      employeeTurnover: '',
      economicContributionMetric: '',
      totalRnDExpenses: '',
      totalCapExDepreciation: '',
      shareBuybacksDividends: '',

    };
  },
  computed: {
    formattedPeriod() {
      if (this.start_period && this.end_period) {
        const startDate = new Date(this.start_period).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        const endDate = new Date(this.end_period).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        return `${startDate} - ${endDate}`;
      }
      return '';
    }
  },

  methods: {
    getSectionStatus(section) {
      // Determine the status of a section based on the page's data
      const pageData = this.$refs[section];
      if (pageData && pageData.sectionStatus) {
        return pageData.sectionStatus;
      }
      return 'N/A';
    },
    getCellStyle(condition) {
      if (condition === 'Complete') {
        return {
          'color': 'rgba(33, 150, 83, 1)',
          'background-color': 'rgba(33, 150, 83, 0.08)'
        };
      } else if (condition === 'Partial') {
        return {
          'color': 'rgba(255, 167, 11, 1)',
          'background-color': 'rgba(255, 167, 11, 0.08)'
        };
      } else if (condition === 'Not Applicable') {
        return {
          'color': 'rgba(211, 64, 83, 1)',
          'background-color': 'rgba(211, 64, 83, 0.08)'
        };
      }
    },
    onSubmitButtonClick(event) {
      event.preventDefault();
      this.onComplete();
    },
    updateProsperityMetrics(metrics) {
      this.totalTaxPaid = metrics.find(m => m.Metric === 'Total tax paid').scoringAchieved;
      this.newEmployees = metrics.find(m => m.Metric === 'Absolute number of new employees').scoringAchieved;
      this.employeeTurnover = metrics.find(m => m.Metric === 'Absolute number of employee turnover').scoringAchieved;
      this.economicContributionMetric = metrics.find(m => m.Metric === 'Economic Contribution').scoringAchieved;
      this.totalRnDExpenses = metrics.find(m => m.Metric === 'Total R&D expenses ($)').scoringAchieved;
      this.totalCapExDepreciation = metrics.find(m => m.Metric === 'Total capital expenditures (CapEx) Depreciation').scoringAchieved;
      this.shareBuybacksDividends = metrics.find(m => m.Metric === 'Share buybacks + Dividend payments').scoringAchieved;
    },

    updateGovernanceMetrics(metrics) {
      this.ethicalBehaviorTraining = metrics.find(m => m.Metric === 'Anti-corruption training').scoringAchieved;
      this.previousYearCorruptionIncidents = metrics.find(m => m.Metric === 'Confirmed corruption incidents for previous year').scoringAchieved;
      this.currentYearCorruptionIncidents = metrics.find(m => m.Metric === 'Confirmed corruption incidents in the current year').scoringAchieved;

    },
    updatePlanetMetrics(metrics) {
      this.greenhouseGasEmissions = metrics.find(m => m.Metric === 'Greenhouse Gas (GHG) emissions').scoringAchieved;
      this.tcfdImplementation = metrics.find(m => m.Metric === 'TCFD implementation').scoringAchieved;
      this.waterConsumptionInStressedAreas = metrics.find(m => m.Metric === 'Water consumption and withdrawal in  water-stressed areas').scoringAchieved;
      this.landUseEcologicalSensitivity = metrics.find(m => m.Metric === 'Land use and ecological sensitivity').scoringAchieved;
      console.log("in update method");
      console.log('Greenhouse Gas Emissions:', this.greenhouseGasEmissions);
      console.log('TCFD Implementation:', this.tcfdImplementation);
      console.log('Water Consumption in Stressed Areas:', this.waterConsumptionInStressedAreas);
      console.log('Land Use Ecological Sensitivity:', this.landUseEcologicalSensitivity);
    },
    handleMetricsUpdate(metrics) {
      this.diversityInclusion = metrics.find(m => m.Metric === 'Diversity and Inclusion').scoringAchieved;
      this.payEquality = metrics.find(m => m.Metric === 'Pay equality').scoringAchieved;
      this.wageLevel = metrics.find(m => m.Metric === 'Wage Level').scoringAchieved;
      this.healthSafetyLevel = metrics.find(m => m.Metric === 'Rate of fatalities').scoringAchieved;
    },
    updateData(data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.startDate = data.startDate;
      this.endDate = data.endDate;

    },
    async saveProsperityMetrics() {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      console.log("in saveProsperityMetrics method");
      console.log('Total Tax Paid:', this.totalTaxPaid);
      console.log('Absolute Number of New Employees:', this.newEmployees);
      console.log('Absolute Number of Employee Turnover:', this.employeeTurnover);
      console.log('Economic Contribution:', this.economicContributionMetric);
      console.log('Total R&D Expenses:', this.totalRnDExpenses);
      console.log('Total Capital Expenditures:', this.totalCapExDepreciation);
      console.log('Share Buybacks + Dividend Payments:', this.shareBuybacksDividends);

      try {
        const response = await axios.post(config.backendApiUrl.concat("/input_prosperitymetrics/" + this.$route.query.submissionID), {
          TotalTaxPaid: this.totalTaxPaid,
          AbsNumberOfNewEmps: this.newEmployees,
          AbsNumberOfNewEmpTurnover: this.employeeTurnover,
          EconomicContribution: this.economicContributionMetric,
          TotalRNDExpenses: this.totalRnDExpenses,
          TotalCapitalExpenditures: this.totalCapExDepreciation,
          ShareBuyBacksAndDividendPayments: this.shareBuybacksDividends
        }, { headers: headers });

        if (response.data.success) {
          console.log('Prosperity metrics saved successfully:', response.data.message);
        } else {
          console.error('Error saving prosperity metrics:', response.data.message);
        }
      } catch (error) {
        console.error('Error saving prosperity metrics:', error.message);
      }
    },

    async savePlanetMetrics() {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      console.log("in savePlanetMetrics method");
      console.log('Greenhouse Gas Emissions:', this.greenhouseGasEmissions);
      console.log('Water Consumption in Stressed Areas:', this.waterConsumptionInStressedAreas);
      console.log('Land Use Ecological Sensitivity:', this.landUseEcologicalSensitivity);
      try {
        const response = await axios.post(config.backendApiUrl.concat("/input_planetmetrics/" + this.$route.query.submissionID), {
          GreenhouseGasEmission: this.greenhouseGasEmissions,
          WaterConsumption: this.waterConsumptionInStressedAreas,
          LandUse: this.landUseEcologicalSensitivity
        }, { headers: headers });

        if (response.data.success) {
          console.log('Planet metrics saved successfully:', response.data.message);
        } else {
          console.error('Error saving planet metrics:', response.data.message);
        }
      } catch (error) {
        console.error('Error saving planet metrics:', error.message);
      }
    },

    async saveGovernanceMetrics() {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      console.log("in here")
      try {
        const response = await axios.post(config.backendApiUrl.concat("/input_governancemetrics/" + this.$route.query.submissionID), {
          AntiCorruptionTraining: this.ethicalBehaviorTraining,
          ConfirmedCorruptionIncidentPrev: this.previousYearCorruptionIncidents,
          ConfirmedCorruptionIncidentCurrent: this.currentYearCorruptionIncidents
        }, { headers: headers });

        if (response.data.success) {
          console.log('Governance metrics saved successfully:', response.data.message);
        } else {
          console.error('Error saving governance metrics:', response.data.message);
        }
      } catch (error) {
        console.error('Error saving governance metrics:', error.message);
      }
    },
    async savePeopleMetrics() {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };

      try {

        const response = await axios.post(config.backendApiUrl.concat("/input_peoplemetrics/" + this.$route.query.submissionID), {
          DiversityAndInclusion: this.diversityInclusion,
          PayEquality: this.payEquality,
          WageLevel: this.wageLevel,
          HealthAndSafetyLevel: this.healthSafetyLevel
        }, { headers: headers });

        if (response.data.success) {
          console.log('Metrics saved successfully:', response.data.message);
        } else {
          console.error('Error saving metrics:', response.data.message);
        }
      } catch (error) {
        console.error('Error saving metrics:', error.message);
      }
    },

    async saveReportInfo() {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };

      const dataToSend = {
        FirstName: this.firstName,
        LastName: this.lastName,
        StartPeriod: this.startDate,
        EndPeriod: this.endDate
      };
      console.log(this.firstName, this.lastName, this.startDate, this.endDate);

      console.log("Data being sent to the backend:", dataToSend);

      try {
        const response = await axios.post(
          config.backendApiUrl.concat("/input_submission/" + this.$route.query.submissionID),
          dataToSend,
          { headers: headers }
        );

        if (response.data.success) {
          console.log('Report info saved successfully:', response.data.message);
        } else {
          console.error('Error saving report info:', response.data.message);
        }
      } catch (error) {
        console.error('Error saving report info:', error.message);
      }
    }

    ,

    async onComplete() {
      console.log("in submitting")
      // Check the checkbox before proceeding
      this.verifyCheckboxBeforeSubmit();
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      console.log("submitttting")
      try {
        const response = await axios.post(config.backendApiUrl.concat("/trans/" + this.$route.query.submissionID), {}, { headers: headers });

        if (response.data.success) {
            this.$router.push({ name: 'SuccessPage',query: { submissionID: this.$route.query.submissionID } });
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    },




    beforeChange(activeTabIndex, nextTabIndex) {
      console.log('beforeChange function triggered')
      console.log('Navigating from', activeTabIndex, 'to', nextTabIndex);
      switch (activeTabIndex) {
        case 0: // Submission Info tab
          this.saveReportInfo();
          break;
        case 1: // People tab
          this.savePeopleMetrics();
          break;
        case 2: // Governance tab
          this.saveGovernanceMetrics();
          break;
        case 3: // Planet tab
          this.savePlanetMetrics();
          break;
        case 4: // Prosperity tab
          this.saveProsperityMetrics();
          this.fetchSubmissionData();
          break;
        case 5: // Review and Submit tab

          break;
      }
    },


    verifyCheckboxBeforeSubmit() {
      if (!this.checkbox) {
        // Display a warning or notification about the unchecked checkbox
        alert('Please tick the checkbox before proceeding.');
        return;
      }

    },
    async fetchSubmissionData() {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      
      try {
        const response = await axios.get(config.backendApiUrl.concat("/get_submission/" + this.$route.query.submissionID), { headers: headers });
        
        if (response.data.success) {
          this.company = response.data.company;
          this.full_name = response.data.full_name;
          this.start_period = response.data.start_period;
          this.end_period = response.data.end_period;
        } else {
          console.error('Error fetching submission data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching submission data:', error.message);
      }
    },
  }
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

.review-cell {
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
  height: 45px;
  padding: 15px;
}

.status-cell {
  border-radius: 100px;
  align-items: center;
  display: inline-block;
  justify-content: center;

}</style>
