<template>
  <b-navbar variant="faded" type="light" class="header mb-5">
    <div class="container px-3">
      <b-navbar-brand to="/">
        <img src="https://img.icons8.com/cotton/32/000000/cat--v4.png"/>
        みんなの方程式
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">

        <template v-if="$store.state.users.user.uid === null">
          <b-button size="sm" variant="white" @click="login" class="login-button">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png">
            Google アカウントでログイン
          </b-button>
        </template>
        <template v-else>
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              {{ $store.state.users.user.name }}
            </template>
            <b-dropdown-item to="/cards/create">新規投稿</b-dropdown-item>
            <b-dropdown-item to="/user">投稿一覧</b-dropdown-item>
            <b-dropdown-item href="#" @click.prevent="logout()">ログアウト</b-dropdown-item>
          </b-nav-item-dropdown>
        </template>

      </b-navbar-nav>
    </div>
  </b-navbar>
</template>

<script>
export default {
  mounted() {
    const user = {
      uid: this.$localStorage.get('user_uid', null),
      displayName: this.$localStorage.get('user_name', null)
    }

    this.$store.commit('users/setUser', user)
  },
  methods: {
    login() {
      this.$store.dispatch('users/login')
      .then(() => {
        this.$localStorage.set('user_uid', this.$store.state.users.user.uid)
        this.$localStorage.set('user_name', this.$store.state.users.user.name)

        this.$router.push('/')
      })
    },
    logout() {
      this.$localStorage.remove('user_uid')
      this.$localStorage.remove('user_name')

      this.$store.commit('users/setUser', { uid: null, displayName: null })

      this.$router.push('/')
    }
  }
}
</script>
