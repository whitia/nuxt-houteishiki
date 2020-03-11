<template>
  <b-navbar variant="faded" type="light" class="header mb-5">
    <div class="container px-3">
      <b-navbar-brand href="/">
        <img src="https://placekitten.com/g/30/30" alt="Kitten">
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <template v-if="$store.getters.getUserName === ''">
          <b-button size="sm" variant="primary" @click="login" class="login-button shadow-sm">
            <img src="https://img.icons8.com/color/24/000000/google-logo.png">
            Sign in with Google
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