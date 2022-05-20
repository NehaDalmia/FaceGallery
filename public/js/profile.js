
import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs , getDoc, setDoc , doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, onAuthStateChanged , signInAnonymously,  updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
// import { UpdateFaceRequest } from "@azure/cognitiveservices-face/esm/models/mappers";

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


let pending = 0;

// Initialize Firebase

initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore()
const auth = getAuth()
var favourites = []
var imageUrls = []
var friendUrls = []
// Processing on login time

onAuthStateChanged(auth, (user) => {
  if (user) { // User is signed in
    
    const docRef = doc(db, "users", user.uid);

    
    
    document.getElementById("name-header").textContent = "Hello, "+user.displayName;
    document.getElementById("myName").setAttribute("placeholder",user.displayName);
    
    getDoc(docRef).then((snapshot) => {   // Getting Friends from Database
      let docData = snapshot.data();
      imageUrls = docData.images;
      let friendNames = docData.friendNames;
      if(docData.friendsPictures != undefined)
        friendUrls = docData.friendsPictures;
      favourites =  docData.favourites;
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
    document.getElementById("favourites-option").setAttribute("href",window.location+"/favourites");
    document.getElementById("happy-page").setAttribute("href",window.location+"/happy");
    document.getElementById("sad-page").setAttribute("href",window.location+"/sad");
    document.getElementById("angry-page").setAttribute("href",window.location+"/angry");
    document.getElementById("surprised-page").setAttribute("href",window.location+"/surprised");
    });

    
  } else {
    // User is signed out
    // ...
  }
});


// Upload Images
// Adding Images to Firebase Storage and Storing their URL in User Database

const imageUploadForm = document.querySelector('#myFile')
imageUploadForm.addEventListener('submit',(e) => {

   e.preventDefault();
  let uploadArr = e.target[0].files;
  for(let index = 0; index<uploadArr.length; index++)
  {
    const image = e.target[0].files[index];
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
        const docRef = doc(db,'users',auth.currentUser.uid);
        updateDoc(docRef,{
          images: arrayUnion(downloadURL)
        });
        if(pending ==0)
        {
          pending = 1;
          alert("Please Do not Leave the Page till the Upload is Over!");
        }
        addImage(downloadURL)
        addImageToDb(downloadURL)
      });
    })
  } 
  $('#modal-image-form').modal('hide');
  imageUploadForm.reset();
})


// face-API.js functions

async function DetectFaceRecognize(url) {
  let detected_faces = await client.face.detectWithUrl(url,
      {
          detectionModel: "detection_03",
          recognitionModel: "recognition_04",
          returnFaceAttributes: ["QualityForRecognition"]
      })
  
  return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium');
}



async function addImageToDb(downloadURL)
{
  
  if(friendUrls == undefined)
  {
    if(pending==1)
    {
      alert("Upload Over!");
      pending = 0;
    }
    return;
  }

   
  
  const MODEL_URL = '/models'
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
  await faceapi.loadFaceLandmarkModel(MODEL_URL)
  await faceapi.loadFaceRecognitionModel(MODEL_URL)
  await faceapi.loadFaceExpressionModel(MODEL_URL)
  for(let index  =0; index <friendUrls.length; index ++)
  {
    
    faceAPIJS(friendUrls[index],downloadURL, index)
  }
  const expressionImageInput = await faceapi.fetchImage(downloadURL)
  const detectionsWithExpressions = await faceapi.detectAllFaces(expressionImageInput).withFaceExpressions()

  // expression categories
  let happy = 0;
  let angry = 0;
  let sad = 0;
  let surprised = 0;

  if(detectionsWithExpressions!= undefined)
  {
    for(let faceindex = 0; faceindex < detectionsWithExpressions.length; faceindex++)
    {
      // expression in categories happy angry sad surprised
      if(detectionsWithExpressions[faceindex].expressions.happy > 0.5)
        happy = 1;
        if(detectionsWithExpressions[faceindex].expressions.angry > 0.5)
        angry = 1;
        if(detectionsWithExpressions[faceindex].expressions.sad > 0.5)
        sad = 1;
        if(detectionsWithExpressions[faceindex].expressions.surprised > 0.5)
        surprised = 1;
    }
  }
  const docRef = doc(db,'users',auth.currentUser.uid);
  if(happy==1)
    updateDoc(docRef,{
      happy_images: arrayUnion(downloadURL),
      });
  if(angry==1)
    updateDoc(docRef,{
      angry_images: arrayUnion(downloadURL),
      });
  if(sad==1)
    updateDoc(docRef,{
      sad_images: arrayUnion(downloadURL),
      });
  if(surprised==1)
    updateDoc(docRef,{
      surprised_images: arrayUnion(downloadURL),
      });
  if(pending==1)
  {
    alert("Upload Over!");
    pending = 0;
  }
  console.log(detectionsWithExpressions);
}

async function faceAPIJS(friendDisplayURL,uploadImage, index)
{
  const MODEL_URL = '/models'

  await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
  await faceapi.loadFaceLandmarkModel(MODEL_URL)
  await faceapi.loadFaceRecognitionModel(MODEL_URL)

  
  //await faceapi.loadFaceExpressionModel(MODEL_URL)
  const faceToFind = await faceapi.fetchImage(friendDisplayURL)
  const singleResult = await faceapi
  .detectSingleFace(faceToFind)
  .withFaceLandmarks()
  .withFaceDescriptor()
 
  if(singleResult == undefined || singleResult.length ==0)
  {
    if(pending==1)
    {
      alert("Upload Over!");
      pending = 0;
    }
    return;
  }
  faceAPIJS_img(singleResult,uploadImage,index);
  
}

async function faceAPIJS_img(singleResult, referenceImgURL,index)
{
  

  const referenceImage = await faceapi.fetchImage(referenceImgURL)
  const results = await faceapi
  .detectAllFaces(referenceImage)
  .withFaceLandmarks()
  .withFaceDescriptors()
  
  if (!results.length) {
    if(pending==1)
    {
      alert("Upload Over!");
      pending = 0;
    }
    return
  }
  const faceMatcher = new faceapi.FaceMatcher(results)

  const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
  
  if(bestMatch != undefined && bestMatch._distance<0.5 )
  {
    console.log(bestMatch._distance)
    console.log("document-id "+ auth.currentUser.uid+"#"+index.toString());
    updateDoc(doc(db,'users',auth.currentUser.uid+"#"+index.toString()),{
      urls : arrayUnion(referenceImgURL)
    })
  }
  
  
}

// Add friend name and picture

const friendUploadForm = document.querySelector('#myFriend')
friendUploadForm.addEventListener('submit',(e) => {
  e.preventDefault();
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
      const docRef = doc(db,'users',auth.currentUser.uid);
      updateDoc(docRef,{
        friendsPictures: arrayUnion(downloadURL),
        friendNames : arrayUnion(name)
      });
      let indi = 0;
      friendUrls.push(downloadURL)
      addFriend(name, friendUrls.length-1);
      indi = friendUrls.length-1;
      
      
      
      console.log(auth.currentUser.uid+"#"+indi.toString())
      setDoc(doc(db,'users',auth.currentUser.uid+"#"+indi.toString()),{
      })
      if(imageUrls!=undefined)
      {
        for(let index1 = 0; index1< imageUrls.length; index1++)
        {
          faceAPIJS(downloadURL,imageUrls[index1],indi);
        }
      }
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
  
  
}
$(document).on('click', '#thumbnail', function() {
  $('#img-modal-body').empty();
  $($(this).parents('div').html()).appendTo('#img-modal-body');
  let imgSrc =  ((document.getElementById("img-modal-body").childNodes[0].childNodes[0].childNodes[0].getAttribute("src")));
  let div = (document.getElementById("img-modal-body").parentNode.childNodes[1].childNodes[3]);
  if(favourites != undefined && favourites.includes(imgSrc))
    div.setAttribute("style","border: none; background: none; color: #FF7F7F;");
  else 
    div.setAttribute("style","border: none; background: none; color: #696969;");
  $('#modal').modal('show');
});

$(document).on('click', '#modal-download-btn', function() {
  downloadImage((document.getElementById("img-modal-body").childNodes[0].childNodes[0].childNodes[0].getAttribute("src")));
});
$(document).on('click', '#modal-favourite-btn', function() {
  let imgSrc = ((document.getElementById("img-modal-body").childNodes[0].childNodes[0].childNodes[0].getAttribute("src")));
  let div = (document.getElementById("img-modal-body").parentNode.childNodes[1].childNodes[3]);
  div.setAttribute("style","border: none; background: none; color: #FF7F7F;");
  if(!(favourites != undefined && favourites.includes(imgSrc)))
  {
    const docRef = doc(db,'users',auth.currentUser.uid);
    updateDoc(docRef,{
      favourites: arrayUnion(imgSrc)
    });
    favourites.push(imgSrc)
  }
  console.log(favourites)
});

async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = 'image file name here'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}



async function addFriend(friendName,index)
{
  var outerTag = document.createElement("li");
  outerTag.setAttribute("class","d-flex")
  outerTag.setAttribute("style","background: #6d7fcc")

  var elem = document.createElement("a");
  elem.setAttribute("href",window.location+"/"+index);
  elem.textContent = "  "+friendName;
  elem.setAttribute("style","flex-grow: 3;")

  var img = document.createElement("img");
  img.setAttribute("class","test2 rounded-circle");
  img.setAttribute("src",friendUrls[index])
  elem.prepend(img)

  
  document.getElementById("homeSubmenu").appendChild(outerTag);
  
  outerTag.appendChild(elem)
  
  
  
}

// Log out
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  window.location.href = "/";
});
