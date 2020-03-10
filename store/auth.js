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
    console.log('login action')
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      const user = result.user;
      console.log('success : ' + user.uid + ' : ' + user.displayName)
      commit('setUserUid', user.uid)
      commit('setUserName', user.displayName)
    }).catch(function(error) {
      var errorCode = error.code;
      console.log('error : ' + error)
    });
  },
  fetchCards({ commit }) {
    console.log(cardRef)
    cardRef
    .orderBy('created_at')
    .limit(9)
    .get()
    .then(res => {
      res.forEach((doc) => {
        console.log('success : ' + `${doc.id} => ${doc.data()}`);
        commit('addCard', doc.data());
      })
    })
    .catch(error => {
      console.log('error : ' + error)
    })
  },
  addCard({ commit }, card) {
    console.log(card)
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
      console.log('Document written with ID: ', docRef.id)
      commit('addCard', card)
    })
    .catch(error => {
      console.error('error: ', error)
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