import firebase from '~/plugins/firebase'
import 'firebase/storage'

const db = firebase.firestore()
const cardRef = db.collection('cards')

const firestorage = firebase.storage()

export const state = () => ({
  items: []
})

export const actions = {
  listFile({ commit }, payload) {
    commit('clearItems')

    return new Promise((resolve, reject) => {
      firestorage.ref('images/').listAll()
      .then(snapshot => {
        snapshot.items.forEach(item => {
          item.getDownloadURL()
          .then(url => {
            commit('addItem', { name: item.name, url: url })
          })
        })
        resolve(true)
      })
      .catch(error => {
        console.log('An error occurred in listFile(): ', error)
        reject(error)
      })
    })
  },
  deleteFile({ commit }, payload) {
    return new Promise((resolve, reject) => {
      firestorage.ref('images/').child(payload.name).delete()
      .then(() => {
        resolve(true)
      })
      .catch(error => {
        console.log('An error occurred in deleteFile(): ', error)
        reject(error)
      })
    })
  }
}

export const mutations = {
  clearItems(state) {
    state.items = []
  }
}