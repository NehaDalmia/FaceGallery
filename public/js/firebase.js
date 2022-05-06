import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, createUserWithEmailAndPassword, updateProfile } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyCawCarNT9kYzWMNzb3SJs0szA6ab4vp5w",
    authDomain: "galleryface-dfb6b.firebaseapp.com",
    projectId: "galleryface-dfb6b",
    storageBucket: "galleryface-dfb6b.appspot.com",
    messagingSenderId: "782225845947",
    appId: "1:782225845947:web:9c3618d2f666c0d341439e",
    measurementId: "G-61ZLTEHST1"
  };

initializeApp(firebaseConfig)

// Initialise FireBase functionalities

const db = getFirestore()
const auth = getAuth()
const colref = collection(db,'friends')
getDocs(colref)
  .then((snapshot) =>{
    let books = []
    snapshot.docs.forEach(doc => {
      books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
  })

// User Sign-Up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value
  const name = signupForm.fname.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .then((result)=>{
      updateProfile(auth.currentUser, {
        displayName: name
      })
      console.log('name set: ',name)
    })
    .catch(err => {
      console.log(err.message)
    })
})