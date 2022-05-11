
import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs , getDoc, setDoc , doc, updateDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {  getAuth, onAuthStateChanged , updateProfile , signInWithEmailAndPassword } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

// const key = "1a11b1b99c844e58a47679a1452d6c11"
// const endpoint = "https://face-neha.cognitiveservices.azure.com/"

// const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
// const client = new Azure.CognitiveservicesFace.FaceClient(credentials, endpoint);

async function DetectFaceRecognize(url) {
  let detected_faces = await client.face.detectWithUrl(url,
      {
          detectionModel: "detection_03",
          recognitionModel: "recognition_04",
          returnFaceAttributes: ["QualityForRecognition"]
      })
  
  return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium');
}

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

// Processing on Entering page


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef).then((snapshot) => { 
      let docData = snapshot.data();
      let friendName = docData.friendNames[friendIndex];
      let friendDisplayURL  = docData.friendsPictures[friendIndex];
      let displayName = document.getElementById("friend-name");
      displayName.textContent = "Memories With: "+friendName;
      
      // Getting Matching Faces
      console.log(friendDisplayURL)
      let uploadImages = docData.images;
      //faceAPIAzure(friendDisplayURL, uploadImages);
      faceAPIJS(friendDisplayURL,uploadImages);
    });

    
  } else {
    // User is signed out
    // ...
  }
});

$('.thumbnail').click(function(){
	$('.modal-body').empty();
	$($(this).parents('div').html()).appendTo('.modal-body');
	$('#modal').modal({show:true});
});

$('#modal').on('show.bs.modal', function () {
   $('.col-6,.row .thumbnail').addClass('blur');
})

$('#modal').on('hide.bs.modal', function () {
   $('.col-6,.row .thumbnail').removeClass('blur');
})

async function addImage(imageUrl)
{
  var outerdivone = document.createElement("div");
  outerdivone.setAttribute("class","col-lg-4 col-sm-6");
  var outerdivtwo =  document.createElement("div");
  outerdivtwo.setAttribute("class","thumbnail img-responsive");
  outerdivone.appendChild(outerdivtwo);

  var aTag = document.createElement("a");
  aTag.setAttribute("title","Image");
  //aTag.setAttribute("href","#")
  var imageTag = document.createElement("img")
  imageTag.setAttribute("src",imageUrl);
  aTag.appendChild(imageTag)
  outerdivtwo.appendChild(aTag);

  document.getElementById("row-class").appendChild(outerdivone);
}

function faceAPIAzure(friendDisplayURL, uploadImages)
{
  async function main() 
  {
    let detected_faces = await  DetectFaceRecognize(friendDisplayURL);
    for (let index = 0; index < uploadImages.length; index++) 
    {
      
      
      const imgURL = uploadImages[index];
      console.log(imgURL)

      if(detected_faces == undefined || detected_faces.length ==0)
        return;

      let target_faces = await  DetectFaceRecognize(imgURL); 

      if(target_faces == undefined || target_faces.length ==0)
        return;

      let target_face_ids = []
      target_faces.forEach(element => {
        target_face_ids.push(element.faceId)
      });
        let results = await client.face.findSimilar(detected_faces[0].faceId, { faceIds : target_face_ids });
        if(results != undefined && results.length != 0)
        {
          console.log("Match Found with confidence: " + results[0].confidence)
          addImage(imgURL)
        }
        else 
          console.log("No match found")
          
          
    } 
    
  }
  main();
}

async function faceAPIJS(friendDisplayURL,uploadImages)
{
  const MODEL_URL = '/models'

  await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
  await faceapi.loadFaceLandmarkModel(MODEL_URL)
  await faceapi.loadFaceRecognitionModel(MODEL_URL)
  // await faceapi.loadFaceExpressionModel(MODEL_URL)
  const faceToFind = await faceapi.fetchImage(friendDisplayURL)
  const singleResult = await faceapi
  .detectSingleFace(faceToFind)
  .withFaceLandmarks()
  .withFaceDescriptor()
 
  if(singleResult == undefined || singleResult.length ==0)
    return;
  for(let index = 0; index < uploadImages.length; index++)
  {
    faceAPIJS_img(singleResult,uploadImages[index]);
  }
}

async function faceAPIJS_img(singleResult, referenceImgURL)
{
  

  const referenceImage = await faceapi.fetchImage(referenceImgURL)
  const results = await faceapi
  .detectAllFaces(referenceImage)
  .withFaceLandmarks()
  .withFaceDescriptors()
  
  if (!results.length) {
    return
  }
  const faceMatcher = new faceapi.FaceMatcher(results)

  const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
  
  if(bestMatch != undefined && bestMatch._distance<0.5 )
  {
    console.log(bestMatch._distance)

    addImage(referenceImgURL)
    
  }
  
}