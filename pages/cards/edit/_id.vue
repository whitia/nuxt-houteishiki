<template>
  <div>
    <Header />

    <div class="container" style="position:relative;">
      <div class="loading"></div>
      <b-form @submit.prevent="updateCard" enctype="multipart/form-data">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-8">
            <b-form-group label="題名" label-for="title">
              <b-form-input
                id="title"
                :value="card.title"
                required
                placeholder="題名"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-2">
            <b-form-group label="値1" label-for="value_1">
              <b-form-input
                id="value_1"
                :value="card.formula.value_1"
                required
                placeholder="値1"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-1 align-self-center text-center">×</div>
          <div class="col-12 col-sm-2">
            <b-form-group label="値2" label-for="value_2">
              <b-form-input
                id="value_2"
                :value="card.formula.value_2"
                required
                placeholder="値2"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-1 align-self-center text-center">＝</div>
          <div class="col-12 col-sm-2">
            <b-form-group label="答え" label-for="valuation">
              <b-form-input
                id="valuation"
                :value="card.formula.valuation"
                required
                placeholder="答え"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-8">
            <b-form-file
              placeholder="画像ファイルを選択してください"
              drop-placeholder="画像ファイルをドラッグ＆ドロップしてください"
              accept="image"
              id="image"
              class="mt-3"
              plain
            ></b-form-file>
            <img :src="card.image" class="img-fluid" />
          </div>
        </div>
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-sm-2">
            <b-button block type="submit" variant="outline-secondary">編集</b-button>
          </div>
        </div>
      </b-form>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import { v4 as uuidv4 } from 'uuid'

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
  created() {
    console.log(this.$store.getters.getUser.uid)
    if (!this.$store.getters.getUser.uid) {
      this.$router.push('/')
    } else if (this.$store.getters.getUser.uid !== this.card.user.uid) {
      this.$router.push('/')
    }
  },
  methods: {
    updateCard(e) {
      document.querySelector('.loading').style.display = 'block';

      let card = {
        old_id: this.$route.params.card.id,
        new_id: uuidv4(),
        user: {
          uid: this.$localStorage.get('user_uid'),
          name: this.$localStorage.get('user_name')
        },
        title: e.target.title.value,
        formula: {
          value_1: e.target.value_1.value,
          value_2: e.target.value_2.value,
          valuation: e.target.valuation.value
        },
        image: e.target.image.files[0]
      }

      if (card.image) {
        this.$store.dispatch('uploadImage', {
          name: card.new_id,
          file: card.image
        })
          .then(image => {
            this.$store.dispatch('updateCard', card)
              .then(() => {
                setTimeout(() => {
                  this.$router.push('/')
                }, 1000)
              })
          })
      } else {
        card.image = this.$route.params.card.image
        this.$store.dispatch('updateCard', card)
          .then(() => {
            setTimeout(() => {
              this.$router.push('/')
            }, 1000)
          })
      }
    }
  }
}
</script>
