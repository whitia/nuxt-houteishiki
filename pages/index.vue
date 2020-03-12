<template>
  <div>
    <Header />

    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <nuxt-link to="/cards/create">新規投稿</nuxt-link>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-4" v-for="(card,key) in $store.getters.getCards" v-bind:key="key">
          <nuxt-link :to="{ name: 'cards-id', params: { id: card.id, card: card } }">
            <b-card
              :img-src="card.image"
              img-top
              img-height="200"
              tag="card"
              class="mb-5 text-center shadow-sm"
            >
              <b-card-title>{{ card.title }}</b-card-title>
              <b-card-text>
                {{ card.formula.value_1 }} ×
                {{ card.formula.value_2 }} ＝
                {{ card.formula.valuation }}
              </b-card-text>
            </b-card>
          </nuxt-link>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header: Header,
    Footer: Footer
  },
  created() {
    this.$store.dispatch('fetchCards')
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 5000)
    })
  }
}
</script>
