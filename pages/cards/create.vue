<template>
  <div>
    <Header />

    <div class="container">
      <b-form @submit.prevent="addCard" enctype="multipart/form-data">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-8">
            <b-form-group id="title" label="題名" label-for="title">
              <b-form-input
                id="title"
                v-model="newTitle"
                required
                placeholder="題名"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-12 col-sm-2">
            <b-form-group id="value_1" label="値1" label-for="value_1">
              <b-form-input
                id="value_1"
                v-model="newValue_1"
                required
                placeholder="値1"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-1 align-self-center text-center">×</div>
          <div class="col-12 col-sm-2">
            <b-form-group id="value_2" label="値2" label-for="value_2">
              <b-form-input
                id="value_2"
                v-model="newValue_2"
                required
                placeholder="値2"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-1 align-self-center text-center">＝</div>
          <div class="col-12 col-sm-2">
            <b-form-group id="valuation" label="答え" label-for="valuation">
              <b-form-input
                id="valuation"
                v-model="newValuation"
                required
                placeholder="答え"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-sm-8">
            <b-form-file
              v-model="newImage"
              placeholder="画像ファイルを選択してください"
              drop-placeholder="画像ファイルをドラッグ＆ドロップしてください"
              accept="image"
              class="mt-3"
              plain
            ></b-form-file>
          </div>
        </div>
        <div class="row justify-content-center mt-4">
          <div class="col-12 col-sm-2">
            <b-button block type="submit" variant="dark">新規投稿</b-button>
          </div>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  data() {
    return {
      newTitle: '',
      newValue_1: '',
      newValue_2: '',
      newValuation: '',
      newImage: null,
    }
  },
  components: {
    Header: Header,
  },
  methods: {
    addCard() {
      const title = this.newTitle
      const formula = {
        value_1: this.newValue_1,
        value_2: this.newValue_2,
        valuation: this.newValuation
      }

      this.$store.dispatch('uploadImage', {
        name: uuidv4(),
        file: this.newImage
      })
        .then(url => {
          this.$store.dispatch('addCard', { title, formula, url })
          this.newTitle = ''
          this.newValue_1 = ''
          this.newValue_2 = ''
          this.newValuation = ''
          this.newImage = ''
        })
    }
  },
}
</script>
