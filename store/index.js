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
  cards: [],
  userCards: [],
  items: []
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
  fetchUserCards({ commit }, payload) {
    commit('clearUserCards')

    return new Promise((resolve, reject) => {
      cardRef.where('user.uid', '==', payload.user.uid)
             .orderBy('created_at', 'desc').limit(payload.limit).get()
        .then(res => {
          res.forEach((doc) => {
            commit('addUserCard', doc.data())
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
      user: {
        uid: card.user.uid,
        name: card.user.name
      },
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
      cardRef.where('id', '==', card.old_id).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const item = {
              id: card.new_id,
              user: {
                uid: card.user.uid,
                name: card.user.name
              },
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
  setUser(state,user) {
    state.user.uid = user.uid
    state.user.name = user.displayName
  },
  addCard(state, cards) {
    state.cards.push(cards)
  },
  addUserCard(state, cards) {
    state.userCards.push(cards)
  },
  clearCard(state) {
    state.cards = []
  },
  clearUserCards(state) {
    state.userCards = []
  },
  updateCardLike(state, payload) {
    state.cards.some(card => {
      if (card.id === payload.card.id) {
        card.like = card.like + 1
        return true
      }
    })
  },
  updateUserCards(state, payload) {
    state.userCards.some((userCard, index) => {
      if (userCard.id === payload.card.id) {
        state.userCards.splice(index, 1)
        return true
      }
    })

    console.log(state.userCards.length)
    if (state.userCards.length > payload.max) {
      state.userCards.splice(payload.max)
    }
  },
  addItem(state, item) {
    state.items.push(item)
  },
  deleteItem(state, payload) {
    state.items.some((item, index) => {
      if (item.name === payload.name) {
        state.items.splice(index, 1)
        return true
      }
    })
  },
  clearItems(state) {
    state.items = []
  }
}

export const getters = {
  getUser(state) {
    return state.user
  },
  getCards(state) {
    return state.cards
  },
  getUserCards(state) {
    return state.userCards
  },
  getItems(state) {
    return state.items
  }
}