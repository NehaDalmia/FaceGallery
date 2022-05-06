import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, createUserWithEmailAndPassword, updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
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

// Helper for Post Requests

window.post = function(url, data) {
  return fetch(url, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}

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

// User Login

const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth,email, password)
  .then(cred => {
    // close the signup modal & reset form
    $('#modal-login-form').modal('hide');
    loginForm.reset();
    window.location = "/profile/"+cred.user.uid
    // post("/", {DisplayName: "cred.user.name", uuidL "cred.user.uuid" });
})
.then((result)=>{
  console.log("")
})
.catch((error) => {
    console.log(err.message)
    alert(error.message + " (" + error.code + ")");
    document.getElementById("signup-pass").value = "";
});
})