<template>
  <div>
    <Header />

    <div class="container" style="position:relative;">
      <div class="loading"></div>
      <b-form @submit.prevent="addCard" enctype="multipart/form-data">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-8">
            <b-form-group label="題名" label-for="title">
              <b-form-input
                id="title"
                v-model="card.title"
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
                v-model="card.formula.value_1"
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
                v-model="card.formula.value_2"
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
                v-model="card.formula.valuation"
                required
                placeholder="答え"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-8">
            <b-form-file
              v-model="card.image"
              placeholder="画像ファイルを選択してください"
              drop-placeholder="画像ファイルをドラッグ＆ドロップしてください"
              accept="image"
              id="image"
              class="mt-3"
              required
              plain
            ></b-form-file>
          </div>
        </div>
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-sm-2">
            <b-button block type="submit" variant="outline-secondary">新規投稿</b-button>
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
  data() {
    return {
      card: {
        title: null,
        formula: {
          value_1: null,
          value_2: null,
          valuation: null,
        },
        image: null
      }
    }
  },
  created() {
    if (!this.$store.state.users.user.uid) {
      this.$router.push('/')
    }
  },
  methods: {
    addCard() {
      document.querySelector('.loading').style.display = 'block';

      let card = {
        id: uuidv4(),
        user: {
          uid: this.$localStorage.get('user_uid'),
          name: this.$localStorage.get('user_name')
        },
        title: this.card.title,
        formula: {
          value_1: this.card.formula.value_1,
          value_2: this.card.formula.value_2,
          valuation: this.card.formula.valuation
        },
        image: this.card.image
      }

      this.$store.dispatch('card/uploadImage', {
        name: card.id,
        file: card.image
      })
      .then(image => {
        card.image = image
        this.$store.dispatch('card/addCard', card)
        .then(() => {
          setTimeout(() => {
            this.$router.push('/user')
          }, 1000)
        })
      })
    }
  }
}
</script>
