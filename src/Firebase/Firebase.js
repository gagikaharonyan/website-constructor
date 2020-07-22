import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAGjaYNXQUB2mQ391Wz6ohMJCJaAKYCXbM",
    authDomain: "website-constructor.firebaseapp.com",
    databaseURL: "https://website-constructor.firebaseio.com",
    projectId: "website-constructor",
    storageBucket: "website-constructor.appspot.com",
    messagingSenderId: "521285781916",
    appId: "1:521285781916:web:11d9c1e4cd598221ac6059",
    measurementId: "G-ZM8BPNSK72"
};


class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig)
        this.auth = app.auth()
        this.database = app.database()
        this.storage = app.storage()
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    getCurrentUser = () => this.auth.currentUser
}

let FB = new Firebase()
export default FB