<template>
    <v-container>
        <v-row no-gutters>
        <v-col>
            <v-row>
                <v-col>
                    <h1>Top Cities in {{ country.name }}</h1>
                    <p>
                        {{ country.description }}
                    </p>
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


export default {
    data() {
        return {
            country: {
                name: ''
            },
            cities: []
        }
    },
    async mounted() {
        await this.fetchCountry();
        await this.fetchCities();
    },
    methods: {
        async fetchCountry() {
            const slug = this.$route.params.name;
            const response = await fetch('http://localhost:9999/.netlify/functions/get-countries');
            const jsonResponse = await response.json();
            this.country = jsonResponse.countries.find(c => {
                c.slug = slugify(c.name);
                return c.slug === slug;
            });

            console.log(this.country);
        },
        async fetchCities() {
            const response = await fetch(`http://localhost:9999/.netlify/functions/get-cities?country=${this.country._id}`);
            const jsonResponse = await response.json();
            this.cities = jsonResponse.cities.map(c => {
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