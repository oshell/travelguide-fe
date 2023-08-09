<template>
    <div>
        <v-container fluid class="header-image">
            <v-row no-gutters v-if="city.image">
                <v-col>
                    <div class="city-image" :style="`background-image: url(${city.image.src});`">
                        <div class="overlay"></div>
                        <div class="title-wrapper">
                            <h1>Top Activities in {{ city.name }}</h1>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
        <v-row no-gutters>
        <v-col>
            <v-row class="activity-list">
                <v-col v-for="(activity, index) in city.activities" :key="index">
                    <v-card class="city-card">
                        <v-img v-if="activity.image" :src="activity.image.src" class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
                                <v-card-title class="text-white" v-text="activity.title"></v-card-title>
                            </v-img>
                            <v-card-title v-else class="text-white" v-text="activity.title"></v-card-title>
                            <v-card-text class="text-white" v-text="activity.description"></v-card-text>
                   
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            city: {}
        }
    },
    async mounted() {
        await this.fetchCity();
    },
    methods: {
        async fetchCity() {
            const id = this.$route.params.id;
            const response = await fetch(`http://localhost:9999/.netlify/functions/get-cities?id=${id}`);
            const jsonResponse = await response.json();
            this.city = jsonResponse.cities[0];
        }
    }
}
</script>

<style lang="scss" scoped>
.city-image {
    height: 600px;
    max-height: 600px;
    background-size: cover;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-image {
    padding: 0;
    display: flex;

    .overlay {
        height: 600px;
        width: 100%;
        background-color: rgba(0,0,0,0.6);
        position: absolute;
        top: 0;
        left: 0;
    }
}

.title-wrapper {
    flex: 1;
    text-align: center;
    z-index: 1;
}
</style>