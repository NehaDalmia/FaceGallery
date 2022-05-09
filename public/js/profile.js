
import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs , getDoc, setDoc , doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, onAuthStateChanged , updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
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

let userId;
let imageUrls = []




async function DetectFaceRecognize(url) {
  // Detect faces from image URL. Since only recognizing, use the recognition model 4.
  // We use detection model 3 because we are only retrieving the qualityForRecognition attribute.
  // Result faces with quality for recognition lower than "medium" are filtered out.
  let detected_faces = await client.face.detectWithUrl(url,
      {
          detectionModel: "detection_03",
          recognitionModel: "recognition_04",
          returnFaceAttributes: ["QualityForRecognition"]
      });
  console.log("success")
  return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium');
}

// Processing on login time

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef).then((snapshot) => { 
      let docData = snapshot.data();
      imageUrls = docData.images;
      let friendNames = docData.friendNames;
      for (let index = 0; index < friendNames.length; index++) {
        addFriend(friendNames[index],index)
      }
      for (let index = 0; index < imageUrls.length; index++) {
        console.log(imageUrls[index]);
        addImage(imageUrls[index])
        DetectFaceRecognize(imageUrls[index])
    }

    });

    
  } else {
    // User is signed out
    // ...
  }
});



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
      addImage(downloadURL)
      
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
      addFriend(name)
    });
  })
})


function addImage(imageUrl)
{
  var elem = document.createElement("img");
  console.log(imageUrl)
  elem.setAttribute("src", imageUrl);
  elem.setAttribute("height", "30");
  elem.setAttribute("width", "30");
  document.getElementById("img").appendChild(elem);
}

function addFriend(friendName,index)
{
  var elem = document.createElement("a")
  elem.setAttribute("href",window.location+"/"+index)
  elem.textContent = friendName
  document.getElementById("homeSubmenu").appendChild(elem);
}


