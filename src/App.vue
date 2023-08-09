<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-main class="d-flex align-center justify-center main-container text-center">
        <v-container fluid class="main-container-inner">
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}

.main-container {
  overflow: hidden;
}

.main-container-inner {
  padding: 0;
}
</style>
