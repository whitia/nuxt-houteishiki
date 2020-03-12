<template>
  <div>
    <Header />

    <div class="container position-relative">
      <div class="loading"></div>
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8">
          <b-card
            :img-src="card.image"
            img-top
            tag="card"
            class="text-center"
          >
            <div class="position-relative">
              <div class="position-top-right">
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
  data: function() {
    return {
      card: this.$route.params.card
    }
  },
  methods: {
    deleteCard() {
      if (!confirm('本当に削除しますか？')) return

      document.querySelector('.loading').style.display = 'block';

      const target = this.$route.params.card.id
      this.$store.dispatch('deleteCard', { target })
        .then(() => {
          setTimeout(() => {
            window.location.href ="/"
          }, 1000)
        })
    }
  }
}
</script>
