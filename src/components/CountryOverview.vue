<template>
    <v-container>
        <v-row no-gutters>
        <v-col>
            <v-row>
                <v-col>
                    <h1>Countries</h1>
                </v-col>
            </v-row>
            <v-row class="country-list">
                <v-col v-for="country in countries" :key="country.name">
                    <router-link :to="`/country/${country.slug}`">
                        <v-card class="country-card">
                            <v-img :src="country.image.src" class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
                                <v-card-title class="text-white" v-text="country.name"></v-card-title>
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
            countries: []
        }
    },
    mounted() {
        this.fetchCountries();
    },
    methods: {
        async fetchCountries() {
            const response = await fetch('http://localhost:9999/.netlify/functions/get-countries');
            const jsonResponse = await response.json();
            this.countries = jsonResponse.countries.map(c => {
                c.slug = slugify(c.name);
                return c;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.country-list {
    overflow: hidden;

    .country-card {
        &:hover {
            cursor: pointer;
        }
    }
}
</style>