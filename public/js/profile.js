
import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs , getDoc, setDoc , doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, onAuthStateChanged , signInAnonymously,  updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

//Firebase Config

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

// Processing on login time

onAuthStateChanged(auth, (user) => {
  if (user) { // User is signed in
    
    const docRef = doc(db, "users", user.uid);
    document.getElementById("name-header").textContent = "Hello, "+user.displayName;
    document.getElementById("myName").setAttribute("placeholder",user.displayName);
    
    getDoc(docRef).then((snapshot) => {   // Getting Friends from Database
      let docData = snapshot.data();
      let imageUrls = docData.images;
      let friendNames = docData.friendNames;
      if(docData.myProfilePicture != undefined)
      {
        document.getElementById("myProfilePic").setAttribute("src",docData.myProfilePicture);
      }
      for (let index = 0; friendNames!=undefined && index < friendNames.length; index++) {
        addFriend(friendNames[index],index)
      }
      for (let index = 0; imageUrls!=undefined && index < imageUrls.length; index++) {
        addImage(imageUrls[index])
    }

    });

    
  } else {
    // User is signed out
    // ...
  }
});



// Adding Images to Firebase Storage and Storing their URL in User Database

const imageUploadForm = document.querySelector('#myFile')
imageUploadForm.addEventListener('submit',(e) => {

   e.preventDefault();
  let uploadArr = e.target[0].files;
  console.log(uploadArr.length)
  for(let index = 0; index<uploadArr.length; index++)
  {
    const image = e.target[0].files[index];
    console.log(image.name)
    const metadata = {
      contentType: image.type
    };
    const storageRef = ref(storage,image.name);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    console.log("uploaded!")
    

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
      $('#modal-image-form').modal('hide');
      imageUploadForm.reset();
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
          alert("Upload Failed, Try Again!");
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
  } 
  $('#modal-image-form').modal('hide');
  imageUploadForm.reset();
})

// Add friend name and picture

const friendUploadForm = document.querySelector('#myFriend')
friendUploadForm.addEventListener('submit',(e) => {
  e.preventDefault();
 console.log(e);
  // console.log(friendUploadForm)

  if(e.target[0].files == undefined || e.target[0].files.length ==0 || friendUploadForm.friendName == undefined)
  {
    alert("Enter Details Correctly");
    $('#modal-login-form').modal('hide');
    friendUploadForm.reset();
    return;
  }

  const image = e.target[0].files[0];
  const name = friendUploadForm.friendName.value;
  
  console.log(image);
  console.log(name);
  const metadata = {
    contentType: image.type
  };
  const storageRef = ref(storage,image.name);
  const uploadTask = uploadBytesResumable(storageRef, image, metadata);
  console.log("uploaded!")
  

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
    $('#modal-login-form').modal('hide');
    friendUploadForm.reset();
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
      console.log(auth.currentUser.uid);
      const docRef = doc(db,'users',auth.currentUser.uid);
      updateDoc(docRef,{
        friendsPictures: arrayUnion(downloadURL),
        friendNames : arrayUnion(name)
      });
      addFriend(name);
    });
  })
  $('#modal-login-form').modal('hide');
  friendUploadForm.reset();
})

// Update Profile

const profileUpdateForm = document.querySelector('#myProfile')
profileUpdateForm.addEventListener('submit',(e) => {
  e.preventDefault();
  console.log(profileUpdateForm.myName)
  console.log(e.target[0].files)
  if(e.target[0].files!=undefined && e.target[0].files.length!=0)
  {
    const image = e.target[0].files[0];
    const metadata = {
      contentType: image.type
    };
    const storageRef = ref(storage,image.name);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    console.log("uploaded!")
    

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
      $('#modal-login-form').modal('hide');
      friendUploadForm.reset();
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
        const docRef = doc(db,'users',auth.currentUser.uid);
        updateDoc(docRef,{
          myProfilePicture: downloadURL
        });
        document.getElementById("myProfilePic").setAttribute("src",downloadURL);
      });
    })
  }
  if(profileUpdateForm.myName != undefined && profileUpdateForm.myName.value != "")
  {
    const name = profileUpdateForm.myName.value;
   
    async function updateName()
    {
    await updateProfile(auth.currentUser, {
      displayName: name
    }).then(function() {
     
      var displayName = auth.currentUser.displayName;
      console.log("name changed to "+displayName)
      document.getElementById("name-header").textContent = "Hello, "+auth.currentUser.displayName;
      document.getElementById("myName").setAttribute("placeholder",auth.currentUser.displayName);
      
    }, function(error) {
      // An error happened.
    });
    }
    updateName();
    
  }
  $('#modal-myprofile-form').modal('hide');
  profileUpdateForm.reset();
})


// function addImage(imageUrl)
// {
  
//   var divTag = document.createElement("outerDiv");
//   var aTag = document.createElement("outerA");
//   var elem = document.createElement("img");
//   divTag.setAttribute("class","item selfie col-lg-3 col-md-4 col-6 col-sm");
//   divTag.setAttribute("style", "overflow: hidden; max-height: 300px;")
//   aTag.setAttribute("href",imageUrl);
//   aTag.setAttribute("class","fancylight popup-btn");
//   aTag.setAttribute("data-fancybox-group","light")
//   elem.setAttribute("src", imageUrl);
//   elem.setAttribute("class", "img-fluid");
//   elem.setAttribute("alt", "");
//   elem.setAttribute("style","object-fit: cover")
//   divTag.appendChild(aTag);
//   aTag.appendChild(elem);
//   document.getElementById("homepage-gallery").appendChild(divTag);
// }
async function addImage(imageUrl)
{
  var outerdivone = document.createElement("div");
  outerdivone.setAttribute("class","col-lg-4 col-sm-6");
  outerdivone.setAttribute("style", "max-height: 300px; overflow: hidden; margin-bottom: 30px;");
  var outerdivtwo =  document.createElement("div");
  outerdivtwo.setAttribute("class","img-thumbnail img-responsive");
  outerdivtwo.setAttribute("id","thumbnail");
  outerdivone.appendChild(outerdivtwo);

  var aTag = document.createElement("a");
  aTag.setAttribute("title","Image");
  //aTag.setAttribute("href","#")
  var imageTag = document.createElement("img")
  imageTag.setAttribute("src",imageUrl);
  imageTag.setAttribute("style","object-fit: cover; max-width: 100%; height: auto; display: block;margin-right: auto; margin-left: auto;");
  aTag.appendChild(imageTag);
  outerdivtwo.appendChild(aTag);

  document.getElementById("row-class").appendChild(outerdivone);

  // add listeners
  
  
}
$(document).on('click', '#thumbnail', function() {
  $('#img-modal-body').empty();
  $($(this).parents('div').html()).appendTo('#img-modal-body');
  $('#modal').modal('show');
});

function addFriend(friendName,index)
{
  var elem = document.createElement("a");
  elem.setAttribute("href",window.location+"/"+index);
  elem.textContent = friendName;
  document.getElementById("homeSubmenu").appendChild(elem);
}

// Log out
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  window.location.href = "/";
});
