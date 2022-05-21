# FaceGallery

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tools and Technology used](#tools-and-technology-used)
4. [Platforms](#platforms)
5. [Developer Guide](#developer-guide)

## Introduction

**FaceGallery** is an image-management web application which uses **Face Recognition** technology to organise images . It allows you to keep track of different people appearing in your pictures by looking for them in the uploaded images and displaying all images of a given person in their own private gallery. It offers a large number of functionalities ranging from **uploading images** to **sorting them by categories** along with providing a beautiful user interface and a seamless user experience. The app is served by a **Node.js + Express server** and the frontend is written in vanilla **JavaScript**, along with **HTML, CSS** and **EJS.**

Check out **FaceGallery** @ [http://facegallery.herokuapp.com](http://facegallery.herokuapp.com). It's free , it's helpful and it is fun!

Each users FaceGallery homepage displays a beautifully rendered dynamic image gallery like this: 

<a href="https://ibb.co/CMXQmhV"><img src="https://i.ibb.co/NmkKtZW/facegallery-home.png" alt="face-homepage" border="0" style="height: 300px"></a>

## Features

### Basic Features

##### 1. User Login and Signup

Allows a super to create and log into their own FaceGallery account to ensure secure management and storage of their images and other data. This feature can be accessed by clicking the **login and sign-up buttons** on the homepage of the app.

<a href="https://ibb.co/nQr4BxJ"><img src="https://i.ibb.co/CVB46RG/login-signup.png" alt="login-signup" border="0" style="height: 300px"></a>

##### 2. Upload Images

User can upload one or more images of their choice from their device which will be rendered and displayed immediately on the homepage gallery. The **Upload Images button** on your profile page is used to upload images.

<a href="https://ibb.co/q0Bc0VN"><img src="https://i.ibb.co/gvyfvhS/face-upload-images.png" alt="upload-images" border="0" style="height: 300px"></a>

##### 3. Add Friends

Users add 'friends' who are people they want to find in their uploaded images. This requires uploading a name and a reference picture of the friend, after which all current and future pictures of that friend can be seen in a separate gallery. The option to add friends is present in the scroll down menu on the left side of the profile page under Friends bar using the **Add Friend button**. Along with this are the options to access the private galleries of all your friends.

<a href="https://ibb.co/TWFhqP0"><img src="https://i.ibb.co/8YS84Px/u1-Artboard-1.png" alt="u1-Artboard-1" border="0"></a>

##### 4. Update Profile Information

The user can update information like their profile picture and/or username. This option is present below the display picture of the user in the **Update Profile button**

<a href="https://ibb.co/pPHVMyS"><img src="https://i.ibb.co/SxkYMrz/update-user.png" title = "Friends gallery with all their pictures " alt="friend-gallery" border="0" style="height: 300px"></a>

### Additional Features

##### 1. Favourites

The user can mark any image to be their favourite by clicking on the **greyed out heart** option on  top left of the images, (if an image is already a favourite the heart will appear pink) . On marking an image as a favourite the heart turns pink in colour. On going to the favourites section on the nabar, the user can access their favourite images gallery.

<a href="https://ibb.co/p0Wn4d8"><img src="https://i.ibb.co/DVGLwQy/u2-02.png" alt="u2-02" border="0"></a>

##### 2. Expression Galleries - XFactor

FaceGallery uses Face Recognition technology to extract certain expressions from the upload images and created curated galleries consisting of all images with a particular expression. These galleries can be accessed from the **Expressions option** on the navigation bar where the user can choose the desired expression they want to see images of. This feature is not present in currently existing online web galleries.

<a href="https://ibb.co/vZkH49w"><img src="https://i.ibb.co/HnqVTZF/u4-02.png" alt="u4-02" border="0"></a>

##### 3. Download Image Gallery

Using the **Get Album button** on the gallery pages of friends/favourites/expressions the user can download all the images collectively in a single zip folder

##### 4. Download Individual Images

Allows the user to download any individual image using the **download option** in the top left corner of the image, which enables this application to be used as an image storing server as well.

<a href="https://ibb.co/tzsb6cn"><img src="https://i.ibb.co/m0qHKtd/faceg7.png" alt="faceg7" border="0"></a>

##### 5. Friends List

User can view their list of friends using the **'Friends' dropdown menu** on the navigation bar where their names as well as their profile pictures are displayed.

<a href="https://ibb.co/qRB6GSz"><img src="https://i.ibb.co/khKZn7p/faceg3.png" alt="faceg3" border="0"></a>

##### 6. Image Thumbnails and Dynamic Gallery

The image thumbnails are visible in the form of a dynamic gallery which resizes itself on screen changes and adjusts the thumbnail sizes and locations accordingly. On clicking the image thumbnail the entire image appears rendered in the form of a polariod with additional options.

<a href="https://ibb.co/QQpD5L2"><img src="https://i.ibb.co/wgBcvV9/u3-03.png" alt="u3-03" border="0"></a>

##### 7. User Demo

The user-homepage contains a link to this document in the **User Guide button** which will help the user use and understand the functionalities of FaceGallery better to get the most out of their experience!

##### 8. Features Tab

The **features tab** on the homepage highlights all the main functionalities of the web application so that the user can make an informed choice before signing up on the website.

<a href="https://ibb.co/bXT5jk6"><img src="https://i.ibb.co/nj9MqFw/faceg12.png" alt="faceg12" border="0"></a>

##### 13. UI/UX Enhancements :sparkles:

1. **Dynamic Image Gallery**: Image thumbnails and dynamically resize based on the current window size. Number of images per row adjusted accordingly
2. **Image Polaroid Blocks**: Each image thumbnail on being clicked renders the image in the form of a beautiful polaroid
3. **Dynamic Navigation Bar**: The navbar on the user homepage can be opened and closed with smooth animation and contains all important information and options pertaining to the user.
4. **Real Time Updates**: The results of all updates such as adding friends and images are real time and do not require any refreshing. The images appear in the gallery instantaneously and the friend is added to the friend menu. 




## Tools and Technology used

| Purpose                                | Technologies/Tools/Libraries used                            |
| -------------------------------------- | ------------------------------------------------------------ |
| Markup                                 | HTML5                                                        |
| Styling                                | CSS3, Bootstrap, Animate.css, Google Fonts                   |
| Frontend Behaviour                     | JavaScript ES6, jQuery                                       |
| Templating Engine                      | EJS                                                          |
| Server Runtime Environment + Framework | Node.js + Express                                            |
| Face Recognition API                   | face-api.js: [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) |
| User Authentication                    | Firebase Authentication                                                |
| Database                 |             Firebase Storage |

## Platforms

- **FaceGallery** has been tested thoroughly and works without issues on the latest version of **Chrome** on **Windows 10**.
- We advise you to use it on **Chrome** or any other **Chromium-based** browser to get the best results.
- We advise you to use it on a **PC** to get the best results.
- **FaceGallery** should work on other browsers (like Edge, Safari) and other devices (like mobile devices), however the layouts and styling might get skewed.

## Developer Guide

1. Clone the repository 
`git clone https://github.com/NehaDalmia/FaceGallery.git`
2. Install the dependencies, run `npm install` from the directory cotaining  `package.json`
3. Run the code using `node app`  from the directory cotaining `app.js`

You can login to the existing website using these guest credentials for an existing account : 
username: `nehadalmia002@gmail.com` password: `123456`

