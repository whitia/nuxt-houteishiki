<template>
  <div>
    <Header />

    <div class="container">
      <div class="row" id="content">
        <div class="col-12 col-sm-3 px-2" v-for="(card,key) in $store.state.cards.cards" v-bind:key="key">
          <nuxt-link :to="{ name: 'cards-id', params: { id: card.id } }">
            <b-card
              :img-src="card.image"
              img-top
              img-height="128"
              tag="card"
              class="mb-3"
            >
              <div class="position-relative">
                <div class="position-top-right">
                  <img src="https://img.icons8.com/officel/20/000000/hearts.png" class="like"
                       @click.prevent="likeCard(card)" v-bind:class="{ grayscale: !card.like }" />
                  <br />
                  <div class="text-center" v-if="card.like">{{ card.like }}</div>
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
    this.$store.dispatch('cards/fetchCards')
    .then(() => {
      document.querySelector('#content').classList.add('visible')
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => {
        this.$nuxt.$loading.finish()}
      , 3000)
    })
  },
  methods: {
    likeCard(card) {
      this.$store.commit('cards/updateCardLike', { card })
      this.$store.dispatch('card/likeCard', { card })
    }
  }
}
</script>
