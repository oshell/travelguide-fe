<template>

        <v-row no-gutters>
            <v-col align-self="center">
                
                    <h1>WhereToTravel</h1>
                    <div class="action-buttons">
                        <v-btn class="home-button" dark color="primary" :to="{name: 'countries'}" >browse by country</v-btn>
                        <v-btn class="home-button" dark color="primary" :to="{name: 'search'}" >search by criteria</v-btn>
                    </div>
               
            </v-col>
        </v-row>

</template>

<script setup>

</script>

<style lang="scss" scoped>
.action-buttons {
    margin: 20px;
}
.home-button {
    margin: 0 10px;
}
</style>