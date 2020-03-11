<template>
  <b-navbar variant="faded" type="light" class="header mb-5">
    <div class="container px-3">
      <b-navbar-brand href="/">
        <img src="https://img.icons8.com/cotton/32/000000/cat--v2.png">
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <template v-if="$store.getters.getUserName === ''">
          <b-button size="sm" variant="white" @click="login" class="login-button">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png">
            Google アカウントでサインイン
          </b-button>
        </template>
        <template v-else>
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              {{ $store.getters.getUserName }}
            </template>
            <b-dropdown-item to="/cards">Dashboard</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </template>
      </b-navbar-nav>
    </div>
  </b-navbar>
</template>

<script>
export default {
  methods: {
    login() {
      this.$store.dispatch('login')
    },
  },
}
</script>