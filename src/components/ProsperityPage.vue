<template>
  <v-table class="scrollable-table">
    <thead>
      <tr>
        <td colspan="4">
          Complete the sub sections below by inputting the scoring achieved
          for each metric
        </td>
        <td>
          <input type="radio" v-model="allApplicable" value="true" />
          Mark entire category as not applicable
        </td>
        <td></td>
      </tr>
      <tr>
        <th class="text-center">Sub section</th>
        <th class="text-center">Metric</th>
        <th class="text-center">Scoring</th>
        <th class="text-center">Applicable</th>
        <th class="text-center">Scoring achieved</th>
      </tr>
    </thead>

    <tbody>
      <template v-for="(item, index) in metrics" :key="index">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.Metric }}</td>
          <td>
            <a href="https://www.weforum.org/stakeholdercapitalism/our-metrics" target="_blank">
              <i class="ti-eye"></i>
              View details and rationale
            </a>
          </td>
          <td>
            <v-switch v-model="item.isApplicable" @change="handleSwitchChange(item, index)" color="#219653">
            </v-switch>


          </td>
          <td>
            <v-text-field v-model="item.scoringAchieved" variant="outlined" style="margin-left: 16px; margin-top: 16px;"
              :disabled="!item.isApplicable || item.Metric === 'Economic Contribution'">
              <template v-slot:prepend>
                <span>#</span>
              </template>

            </v-text-field>




          </td>
        </tr>

        <!-- Economic Contribution details -->
        <tr v-if="item.Metric === 'Economic Contribution' && isEconomicContributionEnabled">
          <td colspan="5">
            <!-- Revenue Section -->
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <h5>Cash inflows:</h5>

              <!-- Revenue Fields -->
              <v-text-field v-model="revenueSources.Revenue" variant="outlined" placeholder="Revenue(+)"
                style="margin-top: 18px; margin-left: 16px;"></v-text-field>

              <v-text-field v-model="revenueSources.GovernmentAssistance" variant="outlined"
                placeholder="Government Assistance(+)" style="margin-top: 18px; margin-left: 16px;"></v-text-field>
            </div>

            <!-- Cost Section -->
            <div style="display: flex; align-items: center;">
              <h5>Cash outflows:</h5>

              <!-- Cost Fields -->
              <v-text-field v-model="costs.CapitalPayments" variant="outlined" placeholder="Capital Payments (-)"
                style="margin-left: 16px;"></v-text-field>

              <v-text-field v-model="costs.GovernmentPayments" variant="outlined" placeholder="Government Payments(-)"
                style="margin-left: 16px;"></v-text-field>

              <v-text-field v-model="costs.CommunityInvestment" variant="outlined" placeholder="Community Investment(-)"
                style="margin-left: 16px;"></v-text-field>
            </div>
          </td>

        </tr>
      </template>
    </tbody>
  </v-table>
</template>





<script>
export default {
  name: 'ProsperityPage',
  data() {
    return {
      allApplicable: false,
      metrics: [
        {
          name: 'Community and social vitality',
          Metric: 'Total tax paid',
          isApplicable: true,
          scoringAchieved: '',
        },
        {
          name: 'Employment and wealth generation',
          Metric: 'Absolute number of new employees',
          isApplicable: true,
          scoringAchieved: '',
        },
        {
          name: '',
          Metric: 'Absolute number of employee turnover',
          isApplicable: true,
          scoringAchieved: '',
        },
        {
          name: '',
          Metric: 'Economic Contribution',
          isApplicable: true,
          scoringAchieved: '',
        },
        {
          name: 'Innovation in better products and services ',
          Metric: 'Total R&D expenses ($)',
          isApplicable: true,
          scoringAchieved: '',
        },
        {
          name: ' ',
          Metric: 'Total capital expenditures (CapEx) Depreciation',
          isApplicable: true,
          scoringAchieved: '',
        },
        {
          name: ' ',
          Metric: 'Share buybacks + Dividend payments',
          isApplicable: true,
          scoringAchieved: '',
        },
      ],
      revenueSources: {
        Revenue: '',
        GovernmentAssistance: '',
      },
      costs: {
        CapitalPayments: '',
        GovernmentPayments: '',
        CommunityInvestment: '',
      },
    };
  },
  computed: {
    economicContribution() {
      const revenue = parseFloat(this.revenueSources.Revenue) || 0;
      const govAssistance = parseFloat(this.revenueSources.GovernmentAssistance) || 0;
      const capPayments = parseFloat(this.costs.CapitalPayments) || 0;
      const govPayments = parseFloat(this.costs.GovernmentPayments) || 0;
      const communityInvestment = parseFloat(this.costs.CommunityInvestment) || 0;
      return revenue + govAssistance - (capPayments + govPayments + communityInvestment);
    },

    isEconomicContributionEnabled() {
      return this.metrics.some(
        item => item.Metric === 'Economic Contribution' && item.isApplicable
      );
    },
    
    sectionStatus() {
      if (this.metrics.every(item => item.isApplicable)) {
        return 'Complete';
      } else if (this.metrics.every(item => !item.isApplicable)) {
        return 'Not Applicable';
      } else {
        return 'Partial';
      }
    },
  },

  watch: {
    economicContribution(newValue) {
      const econContributionMetric = this.metrics.find(item => item.Metric === 'Economic Contribution');
      if (econContributionMetric) {
        econContributionMetric.scoringAchieved = newValue.toFixed(2); // Rounded to 2 decimal places
      }
    },

    allApplicable(newValue) {
      this.metrics.forEach(item => (item.isApplicable = !newValue));
    },

    metrics: {
      deep: true,
      handler() {
        this.saveMetricsToParent();
      }
    },
  },

  methods: {
    handleSwitchChange(item, index) {
      if (!item.isApplicable) {
        this.metrics[index].scoringAchieved = '';
      }
    },

    saveMetricsToParent() {
      this.$emit('updateProsperityMetrics', this.metrics);
      console.log(this.metrics);
    }
  }
}
</script>


<style scoped> .scrollable-table {
   max-height: 400px;
  
   overflow: auto;

 }
</style>


