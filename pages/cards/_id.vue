<template>
  <div>
    <Header />

    <div class="container" style="position:relative;">
      <div class="loading"></div>
      <div class="row justify-content-center" id="content">
        <div class="col-12 col-sm-9">
          <b-card
            :img-src="$store.state.card.card.image"
            img-top
            tag="card"
          >
            <div class="position-relative">
              <div class="position-top-right">
                <img src="https://img.icons8.com/officel/20/000000/hearts.png" class="like"
                     @click.prevent="likeCard()" v-bind:class="{ grayscale: !$store.state.card.card.like }" />
                <br />
                <div class="text-center" v-if="$store.state.card.card.like">
                  {{ $store.state.card.card.like }}
                </div>
              </div>
              <!-- <div class="position-top-right" v-if="$store.state.card.isOwner">
                <nuxt-link :to="{ name: 'cards-edit-id', params: { id: $store.state.card.card.id } }">
                  編集
                </nuxt-link> /
                <a href="#" @click.prevent="deleteCard()">削除</a>
              </div> -->
            </div>
            <b-card-title>{{ $store.state.card.card.title }}</b-card-title>
            <b-card-text>
              {{ $store.state.card.card.formula.value_1 }} ×
              {{ $store.state.card.card.formula.value_2 }} ＝
              {{ $store.state.card.card.formula.valuation }}
            </b-card-text>
          </b-card>
          <h4 class="mt-3">{{ $store.state.card.card.user.name }} の他の方程式</h4>
          <div class="grid-wrap">
            <div class="grid" v-for="(card,key) in $store.state.card.userCards" v-bind:key="key">
              <nuxt-link :to="{ name: 'cards-id', params: { id: card.id } }">
                <b-card
                  :img-src="card.image"
                  img-top
                  tag="card"
                  class="mb-3 small"
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
  created() {
    const id = this.$route.params.id
    const user = this.$store.state.users.user

    this.$store.dispatch('card/fetchCard', { id })
    .then(() => {
      document.querySelector('#content').classList.add('visible')

      if (user.uid === this.$store.state.card.card.user.uid) {
        this.$store.commit('card/setIsOwner', true)
      }

      const card = this.$store.state.card.card
      this.$store.dispatch('card/fetchUserCards', { user: card.user, limit: 13 })
      .then(() => {
        this.$store.commit('card/updateUserCards', { card, max: 12 })
      })
    })
  },
  methods: {
    deleteCard() {
      if (!confirm('本当に削除しますか？')) return

      document.querySelector('.loading').style.display = 'block';

      const card = this.$store.state.card.card

      this.$store.dispatch('card/deleteFile', { name: card.id })

      this.$store.dispatch('card/deleteCard', { card })
      .then(() => {
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      })
    },
    likeCard() {
      const card = this.$store.state.card.card
      this.$store.commit('card/updateCardLike')
      this.$store.dispatch('card/likeCard', { card })
    }
  }
}
</script>
