import firebase from '~/plugins/firebase'
import 'firebase/storage'

const db = firebase.firestore()
const cardRef = db.collection('cards')

const firestorage = firebase.storage()

export const state = () => ({
  user: {
    uid: null,
    name: null
  },
  cards: []
})

export const actions = {
  login({ commit }) {
    return new Promise((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then(result => {
          commit('setUser', result.user)
          resolve(true)
        })
        .catch(error => {
          console.error('An error occurred in login(): ', error)
          reject(error)
        })
    })
  },
  fetchCards({ commit }) {
    commit('clearCard')

    return new Promise((resolve, reject) => {
      cardRef.orderBy('created_at', 'desc').get()
        .then(res => {
          res.forEach((doc) => {
            commit('addCard', doc.data())
            resolve(true)
          })
        })
        .catch(error => {
          console.error('An error occurred in fetchCards(): ', error)
          reject(error)
        })
    })
  },
  uploadImage({ commit }, image) {
    return new Promise((resolve, reject) => {
      firestorage.ref('images/' + image.name).put(image.file)
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
            .then(url => {
              resolve(url)
            })
        })
        .catch(error => {
          console.error('An error occurred in uploadImage(): ', error)
          reject(error)
        })
    })
  },
  addCard({ commit }, card) {
    const item = {
      id: card.id,
      title: card.title,
      formula: card.formula,
      image: card.image,
      like: 0,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    }

    return new Promise((resolve, reject) => {
      cardRef.add(item)
        .then(ref => {
          resolve(true)
        })
        .catch(error => {
          console.error('An error occurred in addCard(): ', error)
          reject(error)
        })
    })
  },
  updateCard({ commit }, card) {
    return new Promise((resolve, reject) => {
      cardRef.where('id', '==', card.target).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const item = {
              id: card.id,
              title: card.title,
              formula: card.formula,
              image: card.image,
              updated_at: firebase.firestore.FieldValue.serverTimestamp()
            }
  
            cardRef.doc(doc.id).update(item)
              .then(ref => {
                resolve(true)
              })
              .catch(error => {
                console.error('An error occurred in addCard(): ', error)
                resolve(error)
              })
          })
        })
      })
  },
  deleteCard({ commit }, payload) {
    return new Promise((resolve, reject) => {
      cardRef.where('id', '==', payload.card.id).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            cardRef.doc(doc.id).delete()
              .then(ref => {
                resolve(true)
              })
              .catch(error => {
                console.error('An error occurred in deleteCard(): ', error)
                reject(error)
              })
          })
        })
    })
  },
  likeCard({ commit }, payload) {
    return new Promise((resolve, reject) => {
      cardRef.where('id', '==', payload.card.id).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            cardRef.doc(doc.id).update({ like: payload.card.like + 1 })
              .then(ref => {
                resolve(true)
              })
              .catch(error => {
                console.error('An error occurred in likeCard(): ', error)
                reject(error)
              })
          })
        })
      })
  },
}

export const mutations = {
  setUser(state,user) {
    state.user.uid = user.uid
    state.user.name = user.displayName
  },
  addCard(state, card) {
    state.cards.push(card)
  },
  clearCard(state) {
    state.cards = []
  },
  updateCardLike(state, payload) {
    console.log(payload)
    state.cards.forEach(card => {
      if (card.id === payload.id) {
        console.log(card)
        card.like = card.like + 1
      }
    })
  }
}

export const getters = {
  getUser(state) {
    return state.user
  },
  getCards(state) {
    return state.cards
  }
}