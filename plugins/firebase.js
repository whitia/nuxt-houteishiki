import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyBRigF2_KeNL10bDDvewDYIswvr75JZBxo",
      authDomain: "whitia.firebaseapp.com",
      databaseURL: "https://whitia.firebaseio.com",
      projectId: "whitia",
      storageBucket: "whitia.appspot.com",
      messagingSenderId: "556127341102",
      appId: "1:556127341102:web:cf8f5021f3fe09276badbf",
      measurementId: "G-BHCCQQH70R"
    }
  )
}

export default firebase