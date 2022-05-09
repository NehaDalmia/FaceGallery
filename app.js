

const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const uuid = require("uuid/v4");

key = "1a11b1b99c844e58a47679a1452d6c11"
endpoint = "https://face-neha.cognitiveservices.azure.com/"



const express = require('express');
const { readFileSync } = require('fs');
const app = express();
const path = require('path')
const { v4: uuidv4 } = require('uuid')

var port = process.env.PORT || 7000;

app.set('view engine','ejs')

app.use('/', express.static(path.join(__dirname, 'public')));


// parses the body of req
app.use(express.urlencoded({'extended':false}))

app.get('/profile/:user',(req,res)=>{
    res.render('userHome');
})

app.get('/profile/:user/:friend',(req,res)=>{
    res.render('userFriends',{friendIndex: req.params.friend});
})

// app.get('/profile',(req,res)=>{
//     res.render('profile');
// })

// app.get('/conversation/:room',(req,res)=>{
//     res.render('conversation',{roomId: req.params.room, displayName: req.query.name});
// })

// app.get('/:room',(req,res)=>{
//     res.render('waitRoom',{roomId: req.params.room, displayName: req.query.name});
// })

// app.post('/:room',(req,res,next)=>{
//     next();
// },
// (req,res)=>{
//     // console.log(req.params.room);
//     // console.log(req.body.name);
//     // console.log(req.body.video);
//     // console.log(req.body.audio);
//     res.render('meet',{
//         roomId: req.params.room,
//         displayName: req.body.name,
//         startVideoMuted: req.body.video,
//         startAudioMuted: req.body.audio});    
// })
const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);

async function DetectFaceRecognize(url) {
    let detected_faces = await client.face.detectWithUrl(url,
        {
            detectionModel: "detection_03",
            recognitionModel: "recognition_04",
            returnFaceAttributes: ["QualityForRecognition"]
        })
    
    return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium');
}

// Find a similar face(s) in the list of IDs. Comapring only the first in list for testing purposes.
// 
// results.forEach (function (result) {
//     console.log("Faces from: " + source_image_file_name + " and ID: " + result.faceId + " are similar with confidence: " + result.confidence + ".");
// });
// async function main() {
//     let detected_faces = await  DetectFaceRecognize("https://firebasestorage.googleapis.com/v0/b/galleryface-dfb6b.appspot.com/o/WhatsApp%20Image%202021-11-10%20at%2011.58.09%20PM.jpeg?alt=media&token=63401390-8e04-42f0-b0f3-8b50c97feaad");    
//     let target_faces = await  DetectFaceRecognize("https://firebasestorage.googleapis.com/v0/b/galleryface-dfb6b.appspot.com/o/271278120_661463331879506_4925854734208269343_n.jpg?alt=media&token=9facbdb0-cd98-4dfa-8ca2-b69fc4ffd24e");    
//     let target_face_ids = []
//     target_faces.forEach(element => {
//         target_face_ids.push(element.faceId)
//     });
//     let results = await client.face.findSimilar(detected_faces[0].faceId, { faceIds : target_face_ids });
//     console.log(results[0].confidence)
//     console.log ("Done.");
// }
// main();



app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})