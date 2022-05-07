import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs , setDoc , doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, createUserWithEmailAndPassword, updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCawCarNT9kYzWMNzb3SJs0szA6ab4vp5w",
  authDomain: "galleryface-dfb6b.firebaseapp.com",
  projectId: "galleryface-dfb6b",
  storageBucket: "galleryface-dfb6b.appspot.com",
  messagingSenderId: "782225845947",
  appId: "1:782225845947:web:9c3618d2f666c0d341439e",
  measurementId: "G-61ZLTEHST1"
};
// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore()
const auth = getAuth()


// storing images to firebase and storing its url in user database


const imageUploadForm = document.querySelector('#myFile')
imageUploadForm.addEventListener('submit',(e) => {
  const image = e.target[0].files[0];
  console.log(image.name)
  const metadata = {
    contentType: image.type
  };
  const storageRef = ref(storage,image.name);
  const uploadTask = uploadBytesResumable(storageRef, image, metadata);
  console.log("uploaded!")
  imageUploadForm.reset();

  uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      console.log(auth.currentUser.uid)
      const docRef = doc(db,'users',auth.currentUser.uid);
      updateDoc(docRef,{
        images: arrayUnion(downloadURL)
      });
    });
  })
})

// Add friend name and picture

const friendUploadForm = document.querySelector('#myFriend')
friendUploadForm.addEventListener('submit',(e) => {
  const image = e.target[0].files[0];
  const name = friendUploadForm.friendName.value;
  console.log(image.name)
  const metadata = {
    contentType: image.type
  };
  const storageRef = ref(storage,image.name);
  const uploadTask = uploadBytesResumable(storageRef, image, metadata);
  console.log("uploaded!")
  friendUploadForm.reset();

  uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      console.log(auth.currentUser.uid)
      const docRef = doc(db,'users',auth.currentUser.uid);
      updateDoc(docRef,{
        friendsPictures: arrayUnion(downloadURL),
        friendNames : arrayUnion(name)
      });
    });
  })
})

// var friendProfilePictures

var friendPic = document.querySelector('.friendPic')
friendPic.setAttribute("src","https://firebasestorage.googleapis.com/v0/b/galleryface-dfb6b.appspot.com/o/271278120_661463331879506_4925854734208269343_n.jpg?alt=media&token=9facbdb0-cd98-4dfa-8ca2-b69fc4ffd24e")