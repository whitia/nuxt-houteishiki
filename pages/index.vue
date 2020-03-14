<template>
  <div>
    <Header />

    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-4" v-for="(card,key) in $store.getters.getCards" v-bind:key="key">
          <!-- <nuxt-link :to="{ name: 'cards-id', params: { id: card.id, card: card } }"> -->
          <nuxt-link :to="`/card?id=${card.id}`">
            <b-card
              :img-src="card.image"
              img-top
              img-height="180"
              tag="card"
              class="mb-5 text-center"
            >
            <div class="position-relative">
              <div class="position-top-left">
                <img src="https://img.icons8.com/officel/20/000000/hearts.png" class="like"
                     @click.prevent="likeCard(card)" v-bind:class="{ grayscale: !card.like }" />
                <br />
                <span class="small" v-if="card.like">{{ card.like }}</span>
              </div>
            </div>
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
      setTimeout(() => {
        this.$nuxt.$loading.finish()}
      , 5000)
    })
  },
  methods: {
    likeCard(card) {
      this.$store.commit('updateCardLike', { card })
      this.$store.dispatch('likeCard', { card })
    }
  }
}
</script>
