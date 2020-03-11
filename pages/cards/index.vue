<template>
  <div>
    <Header />

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8">
          <nuxt-link to="/cards/create">新規作成</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    Header: Header,
  },
}
</script>