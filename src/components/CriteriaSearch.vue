<template>
    <v-container>
        <v-row no-gutters>
            <v-col>
                <v-row>
                    <v-col>
                        <h1>Search By Criteria</h1>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-select label="country" v-model="selectedCountry" :items="countryOptions" @update:modelValue="handleChange" multiple></v-select>
                    </v-col>
                    <v-col>
                        <v-select label="months" v-model="selectedMonth" :items="monthsOptions" @update:modelValue="handleChange" multiple></v-select>
                    </v-col>
                    <v-col>
                        <v-select label="budget" v-model="selectedBudget" :items="budgetOptions" @update:modelValue="handleChange" multiple></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-range-slider
                            persistent-hint
                            hint="temprature"
                            v-model="temprature"
                            step="5"
                            :max="50"
                            :min="-10"
                            thumb-label="always"
                            @update:modelValue="handleChange"
                        ></v-range-slider>
                    </v-col>
                </v-row>
                <v-row class="city-list">
                    <v-col v-for="city in cities" :key="city.name">
                        <router-link :to="`/city/${city._id}/${city.slug}`">
                            <v-card class="city-card">
                                <v-img :src="city.image.src" class="align-end"
                                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
                                    <v-card-title class="text-white" v-text="city.name"></v-card-title>
                                </v-img>
                            </v-card>
                        </router-link>

                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
    
<script>
const slugify = text =>
    text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')

function debounce (fn, delay) {
  var timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

let citiesCache = [];

export default {
    data() {
        return {
            cities: [],
            countryOptions: [],
            selectedCountry: [],
            monthsOptions: ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            selectedMonth: [],
            budgetOptions: ['low', 'medium', 'high'],
            selectedBudget: [],
            temprature: [10,40]

        }
    },
    async mounted() {
        await this.fetchCountries();
        await this.fetchCities();
    },
    methods: {
        handleChange: debounce(function() {
            this.filterCities();
        }, 300),
        async fetchCountries() {
            const response = await fetch('http://localhost:9999/.netlify/functions/get-countries');
            const jsonResponse = await response.json();
            this.countryOptions = jsonResponse.countries.map(c => {
                return {
                    title: c.name,
                    value: c._id
                }
            });
        },
        filterCities() {
            this.cities = citiesCache.filter(c => {
                // filter by country
                let countryMatch = true;
                if (this.selectedCountry.length) {
                    countryMatch = this.selectedCountry.includes(c.country);
                    if (!countryMatch) return false;
                }

                let monthsMatch = true;
                if (this.selectedMonth.length) {
                    monthsMatch = false;
                    this.selectedMonth.forEach(m => {
                        if (c.bestMonths && c.bestMonths.months.includes(m)) {
                            monthsMatch = true;
                        }
                    })
                    if (!monthsMatch) return false;
                }

                let budgetMatch = true;
                if (this.selectedBudget.length) {
                    budgetMatch = false;
                    if (this.selectedBudget.includes('low') && c.costOfLiving < 1000) budgetMatch = true;
                    if (this.selectedBudget.includes('medium') && c.costOfLiving > 1000 && c.costOfLiving < 1700) budgetMatch = true;
                    if (this.selectedBudget.includes('high') && c.costOfLiving > 1700) budgetMatch = true;
                    if (!budgetMatch) return false;
                }

                let tempratureMatch = false;
                if (this.temprature) {
                    const min = this.temprature[0];
                    const max = this.temprature[1];

                    // if user selected month, only match 
                    // if we have temprature in one of the selected months
                    if (this.selectedMonth.length) {
                        this.selectedMonth.forEach(m => {
                            const monthTemp = c.tempratures[m];
                            if (monthTemp > min && monthTemp < max) {
                                tempratureMatch = true;
                            }
                        })
                    } else {
                        this.monthsOptions.forEach(m => {
                            const monthTemp = c.tempratures[m];
                            if (monthTemp > min && monthTemp < max) {
                                tempratureMatch = true;
                            }
                        })
                    }
                    if (!tempratureMatch) return false;
                }
  
                return countryMatch && monthsMatch && budgetMatch && tempratureMatch;
            });
        },
        async fetchCities() {
            const response = await fetch(`http://localhost:9999/.netlify/functions/get-cities`);
            const jsonResponse = await response.json();
            citiesCache = jsonResponse.cities.map(c => {
                c.slug = slugify(c.name);
                return c;
            });
        }
    }
}
</script>
    
<style lang="scss" scoped>
.city-list {
    overflow: hidden;

    .city-card {
        &:hover {
            cursor: pointer;
        }
    }
}
</style>