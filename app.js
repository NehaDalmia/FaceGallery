

const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
// const uuid = require("uuid/v4");
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
app.use('/js', express.static(__dirname + '/node_modules/@azure/ms-rest-js/dist'));
app.use('/js', express.static(__dirname + '/node_modules/@azure/cognitiveservices-face/dist'));
// app.use('/js', express.static(__dirname + '/node_modules/@azure')); // redirect JS jQuery


// parses the body of req
app.use(express.urlencoded({'extended':false}))

app.get('/profile/:user',(req,res)=>{
    res.render('userHome');
})
app.post('/profile/:user',(req,res)=>{
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




app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})