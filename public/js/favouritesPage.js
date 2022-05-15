import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs , getDoc, setDoc , doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, onAuthStateChanged , updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

// const key = "1a11b1b99c844e58a47679a1452d6c11"
// const endpoint = "https://face-neha.cognitiveservices.azure.com/"

// const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
// const client = new Azure.CognitiveservicesFace.FaceClient(credentials, endpoint);


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

let imageUrls = [];
let friendName;
// Processing on Entering page


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef).then((snapshot) => { 
      let docData = snapshot.data();
      let uploadImages = docData.favourites;
      imageUrls = uploadImages;
      for(let index = 0; uploadImages!=undefined && index <uploadImages.length; index++)
      {
          addImage(uploadImages[index]);
      }     
    });

    
  } else {
    // User is signed out
    // ...
  }
});

const downloadBtn = document.getElementById("downloadButton");
downloadBtn.addEventListener("click", function()
{
  console.log(imageUrls);
  if(imageUrls ==  undefined || imageUrls.length ==0)
  {
    alert("Please Wait For The Images To Load Before Downloading");
    return;
  }
  downloadAndZip(imageUrls);
});


$('.thumbnail').click(function(){
  $('.modal-body').empty();
  $($(this).parents('div').html()).appendTo('.modal-body');
  $('#modal').modal({show:true});
});

// $('#modal').on('show.bs.modal', function () {
//    $('.col-6,.row .thumbnail').addClass('blur');
// })

// $('#modal').on('hide.bs.modal', function () {
//    $('.col-6,.row .thumbnail').removeClass('blur');
// })

async function addImage(imageUrl)
{
  var outerdivone = document.createElement("div");
  outerdivone.setAttribute("class","col-lg-4 col-sm-6");
  outerdivone.setAttribute("style", "max-height: 300px; overflow: hidden; margin-bottom: 30px;");
  var outerdivtwo =  document.createElement("div");
  outerdivtwo.setAttribute("class","thumbnail img-responsive");
  outerdivtwo.setAttribute("id","thumbnail");
  outerdivone.appendChild(outerdivtwo);

  var aTag = document.createElement("a");
  aTag.setAttribute("title","Image");
  //aTag.setAttribute("href","#")
  var imageTag = document.createElement("img")
  imageTag.setAttribute("src",imageUrl);
  imageTag.setAttribute("style","object-fit: cover")
  aTag.appendChild(imageTag)
  outerdivtwo.appendChild(aTag);

  document.getElementById("row-class").appendChild(outerdivone);

  // add listeners
  $(document).on('click', '#thumbnail', function() {
    $('.modal-body').empty();
    $($(this).parents('div').html()).appendTo('.modal-body');
    $('#modal').modal({show:true});
  });
  
}



// Zipping and Downloading Files


const download = url => {
  return fetch(url).then(resp => resp.blob());
};

const downloadByGroup = (urls, files_per_group=5) => {
  return Promise.map(
    urls, 
    async url => {
      return await download(url);
    },
    {concurrency: files_per_group}
  );
}

const exportZip = blobs => {
  const zip = JSZip();
  blobs.forEach((blob, i) => {
    zip.file(`file-${i}.jpg`, blob);
  });
  zip.generateAsync({type: 'blob'}).then(zipFile => {
    const currentDate = new Date().getTime();
    const fileName = `combined-favourites.zip`;
    return saveAs(zipFile, fileName);
  });
}

function downloadAndZip(urls)
{
  return downloadByGroup(urls, 5).then(exportZip);
}