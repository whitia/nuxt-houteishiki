<template>
  <div>
    <Header />

    <div class="container" style="position:relative;">
      <div class="loading"></div>
      <div class="row justify-content-center">
        <div class="col-12 col-sm-9">
          <b-card
            :img-src="card.image"
            img-top
            tag="card"
            class="text-center"
          >
            <div class="position-relative">
              <div class="position-top-left">
                <img src="https://img.icons8.com/officel/20/000000/hearts.png" class="like"
                     @click.prevent="likeCard()" v-bind:class="{ grayscale: !card.like }" />
                <br />
                <span class="small" v-if="card.like">{{ card.like }}</span>
              </div>
              <div class="position-top-right" v-if="auth">
                <nuxt-link :to="{ name: 'cards-edit-id', params: { id: card.id, card: card } }">編集</nuxt-link> /
                <a href="#" @click.prevent="deleteCard()">削除</a>
              </div>
            </div>
            <b-card-title>{{ card.title }}</b-card-title>
            <b-card-text>
              {{ card.formula.value_1 }} ×
              {{ card.formula.value_2 }} ＝
              {{ card.formula.valuation }}
            </b-card-text>
          </b-card>
          <div class="row my-5">
            <div class="col-12 mb-3">
              <h4>{{ this.card.user.name }} の他の方程式</h4>
            </div>
            <div class="col-12 col-sm-4" v-for="(card,key) in userCards" v-bind:key="key">
              <nuxt-link :to="{ name: 'cards-id', params: { id: card.id, card: card } }">
                <b-card
                  :img-src="card.image"
                  img-top
                  img-height="130"
                  tag="card"
                  class="mb-4 text-center small"
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
  async asyncData(context) {
    const id = context.query.id
    const card = await context.store.dispatch('fetchCardDetail', { id })
    const user = context.store.getters.getUser
    const max = 3
    const auth = false
    
    if (user.id === card.user.uid) {
      auth = !auth
    }

    await context.store.dispatch('fetchUserCards', { user: card.user, limit: max + 1 })
    await context.store.commit('updateUserCards', { card, max })
    const userCards = context.store.getters.getUserCards

    return {
      card: card,
      auth: auth,
      userCards: userCards
    }
  },
  methods: {
    deleteCard() {
      if (!confirm('本当に削除しますか？')) return

      document.querySelector('.loading').style.display = 'block';

      this.$store.dispatch('deleteFile', { name: this.card.id })

      this.$store.dispatch('deleteCard', { card: this.card })
        .then(() => {
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        })
    },
    likeCard() {
      this.$store.commit('updateCardLike', { card: this.card })
      this.$store.dispatch('likeCard', { card: this.card })
    }
  }
}
</script>
