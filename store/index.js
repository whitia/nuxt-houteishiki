import firebase from '~/plugins/firebase'

const db = firebase.firestore();
const cardRef = db.collection('cards')

export const state = () => ({
 userUid: '',
 userName: '',
 cards: []
})

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

export const actions = {
  login({ commit }) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      const user = result.user;
      commit('setUserUid', user.uid)
      commit('setUserName', user.displayName)
    }).catch(function(error) {
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
      formula: {
        value_1: card.formula.value_1,
        value_2: card.formula.value_2,
        valuation: card.formula.valuation
      },
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(docRef => {
      commit('addCard', card)
    })
    .catch(error => {
      console.error('An error occurred in addCard(): ', error)
    })
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