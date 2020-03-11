import firebase from '~/plugins/firebase'
import 'firebase/storage'

const db = firebase.firestore();
const cardRef = db.collection('cards')

const firestorage = firebase.storage();

export const state = () => ({
  userUid: '',
  userName: '',
  cards: []
})

export const actions = {
  login({ commit }) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        commit('setUserUid', user.uid)
        commit('setUserName', user.displayName)
      })
      .catch(error => {
        console.error('An error occurred in login(): ', error)
      });
  },
  fetchCards({ commit }) {
    cardRef
      .orderBy('created_at', 'desc')
      .limit(9)
      .get()
        .then(res => {
          res.forEach((doc) => {
            commit('addCard', doc.data());
          })
        })
        .catch(error => {
          console.error('An error occurred in fetchCards(): ', error)
        })
  },
  addCard({ commit }, card) {
    cardRef
      .add({
        title: card.title,
        formula: card.formula,
        url: card.url,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      })
        .then(docRef => {
          commit('addCard', card)
        })
        .catch(error => {
          console.error('An error occurred in addCard(): ', error)
        })
  },
  uploadImage({ commit }, image) {
    return new Promise((resolve, reject) => {
      const uploadTask = firestorage
        .ref('images/' + image.name)
        .put(image.file)
          .then(snapshot => {
            snapshot.ref.getDownloadURL()
              .then(url => {
                resolve(url)
              })
              .catch(error => {
                console.error(error)
              })
          })
          .catch(error => {
            console.error('An error occurred in uploadImage(): ', error)
          })
    })
  }
}

export const mutations = {
  setUserUid(state,userUid) {
    state.userUid = userUid
  },
  setUserName(state,userName) {
    state.userName = userName
  },
  addCard(state, card) {
    state.cards.push(card)
  },
  clearCard(state) {
    state.cards = []
  }
}

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  getCards(state) {
    return state.cards
  }
}