<template>
  <v-container>

    <v-form>
    <v-row>
  <v-col cols="6">

      <label>First Name </label>
      <v-text-field
        v-model="firstName"
        placeholder="Enter your first name"
        variant = "outlined" 
        required
      ></v-text-field>
      </v-col>
  
 <v-col cols="6" >
      <label>Last Name </label>
      <v-text-field
        v-model="lastName"
         placeholder="Enter your last name"
         variant = "outlined" 
        required
      ></v-text-field>
       </v-col>


</v-row>

      <p>Please select your reporting period</p>

      <label>Start Date</label>
      <v-text-field v-model="startDate" type="date"  variant = "outlined" ></v-text-field>

      <label>End Date</label>
      <v-text-field v-model="endDate" 
       type="date"  variant = "outlined" 
    
       >
       </v-text-field >

       
    
    </v-form>

  </v-container>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      startDate: null,
      endDate: null,
    };
  },
  methods: {
     saveDataToParent() {
      // Emitting the data to the parent or any other action you'd like
      this.$emit('updateData', {
        firstName: this.firstName,
        lastName: this.lastName,
        startDate: this.startDate,
        endDate: this.endDate
      });
      console.log({
        firstName: this.firstName,
        lastName: this.lastName,
        startDate: this.startDate,
        endDate: this.endDate
      });
    }
  },
  watch: {
    firstName() {
      this.saveDataToParent();
    },
    lastName() {
      this.saveDataToParent();
    },
    startDate() {
      this.saveDataToParent();
    },
    endDate() {
      this.saveDataToParent();
    },
  },
};
</script>
