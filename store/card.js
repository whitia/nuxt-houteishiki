import firebase from '~/plugins/firebase'
import 'firebase/storage'

const db = firebase.firestore()
const cardRef = db.collection('cards')
const firestorage = firebase.storage()

export const state = () => ({
  card: {
    id: null,
    title: null,
    formula: {
      value_1: null,
      value_2: null,
      valuation: null
    },
    image: null,
    user: {
      uid: null,
      name: null
    },
    created_at: null,
    updated_at: null
  },
  isOwner: false,
  userCards: []
})

export const actions = {
  fetchCard({ commit }, payload) {
    commit('clearCard')

    return new Promise((resolve, reject) => {
      cardRef.where('id', '==', payload.id).get()
      .then(res => {
        if (res.size) {
          res.forEach((doc) => {
            commit('setCard', doc.data())
            resolve(true)
          })
        } else {
          resolve(404)
        }
      })
      .catch(error => {
        console.error('An error occurred in fetchCard(): ', error)
        reject(error)
      })
    })
  },
  addCard({ commit }, card) {
    const item = {
      id: card.id,
      user: card.user,
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
            console.error('An error occurred in updateCard(): ', error)
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
          cardRef.doc(doc.id).update({ like: payload.card.like })
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

  // ユーザーのカード
  fetchUserCards({ commit }, payload) {
    commit('clearUserCards')

    return new Promise((resolve, reject) => {
      cardRef.where('user.uid', '==', payload.user.uid).orderBy('created_at', 'desc')
             .limit(payload.limit).get()
      .then(res => {
        res.forEach((doc) => {
          commit('addUserCard', doc.data())
          resolve(true)
        })
      })
      .catch(error => {
        console.error('An error occurred in fetchUserCards(): ', error)
        reject(error)
      })
    })
  },

  // 画像ファイル
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
  // カード詳細
  setCard(state, card) {
    state.card = card
  },
  clearCard(state) {
    state.cards = null
  },

  // カードの作成者
  setIsOwner(state, bool) {
    
    state.isOwner = bool
  },

  // ユーザーのカード一覧
  addUserCard(state, cards) {
    state.userCards.push(cards)
  },
  clearUserCards(state) {
    state.userCards = []
  },
  updateUserCards(state, payload) {
    state.userCards.some((userCard, index) => {
      if (userCard.id === payload.card.id) {
        state.userCards.splice(index, 1)
        return true
      }
    })

    if (state.userCards.length > payload.max) {
      state.userCards.splice(payload.max)
    }
  },

  // カードのLikeインクリメント
  updateCardLike(state, payload) {
    state.card.like = state.card.like + 1
  },

  // ユーザーの他のカード
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
  }
}