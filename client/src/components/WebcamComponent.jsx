import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import * as faceapi from '../../dist/face-api.esm.js';
import Welcome from './WelcomeComponent.jsx';
import Loading from './Loading.jsx';
import Swal from 'sweetalert2';
import './style/WebcamComponent.css';

function Webcam({ register, login, setLoginOrWebcam, validEmail }) {
  const modelPath = '../../model/';
  const minScore = 0.2;
  const maxResults = 5;
  const [isConditionMet, setIsConditionMet] = useState(false);
  const [userValidate, setUserValidate] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  //const logRef = useRef(null);
  let optionsSSDMobileNet;
  let descriptorsToRegistratiron = [];
  let descriptorsFaceDontMatch = [];

  useEffect(() => {
    main();
  }, []);

  const borderStyle = {
    border: isConditionMet ? '20px solid green' : '20px solid red'
  };

  function drawFaces(canvas, data, fps, video) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'small-caps 20px "Segoe UI"';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, 10, 25);
    for (const person of data) {
      // draw box around each face
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'deepskyblue';
      ctx.fillStyle = 'deepskyblue';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.rect(person.detection.box.x, person.detection.box.y, person.detection.box.width, person.detection.box.height);
      ctx.stroke();
      ctx.globalAlpha = 1;
      // draw text labels
      const expression = Object.entries(person.expressions).sort((a, b) => b[1] - a[1]);
      if(person.angle.yaw > -40 && person.angle.yaw < 40 && person.angle.pitch < 10 && person.angle.pitch > -2){
        setIsConditionMet(true);
        detectFaceDescriptor(video);
      } else {
        setIsConditionMet(false);
      };
      ctx.fillStyle = 'black';
      ctx.fillText(`gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`, person.detection.box.x, person.detection.box.y - 59);
      ctx.fillText(`expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`, person.detection.box.x, person.detection.box.y - 41);
      ctx.fillText(`age: ${Math.round(person.age)} years`, person.detection.box.x, person.detection.box.y - 23);
      ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 5);
      ctx.fillStyle = 'lightblue';
      ctx.fillText(`gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`, person.detection.box.x, person.detection.box.y - 60);
      ctx.fillText(`expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`, person.detection.box.x, person.detection.box.y - 42);
      ctx.fillText(`age: ${Math.round(person.age)} years`, person.detection.box.x, person.detection.box.y - 24);
      ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 6);
    };
  };

  async function detectVideo(video, canvas) {
    if (!video || video.paused) return false;
    const t0 = performance.now();
    try {
      const result = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();      
      const fps = 1000 / (performance.now() - t0);
      drawFaces(canvas, result, fps.toLocaleString(), video);
      requestAnimationFrame(() => detectVideo(video, canvas));
      return true;
    } catch (err) {
      console.log(`Detect Error: ${String(err)}`);
      return false;
    };
  };

  async function sendRegisterData(descriptor) {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ validEmail, descriptor })
      });
      const data = await res.json();

      if (data.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 3000
        });
        setTimeout(() => {
          setLoginOrWebcam(false);
        }, 2000);
      };
    } catch (err) {
      console.log(`Fetch Error: ${err}`);
    };
  };

  async function detectFaceDescriptor(video) {
    if (!video || video.paused) return false;
    try {
      const singleResult = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const descriptor = singleResult.descriptor;

      if(descriptorsToRegistratiron.length < 3) descriptorsToRegistratiron.push(descriptor)
      if (descriptor != null && register && descriptorsToRegistratiron.length == 1) {
        await sendRegisterData(descriptorsToRegistratiron);
      };
      if(login){
        fetchToAuthenticate(singleResult);
      } 

      return true;
    } catch (err) {
      console.log(`Detect Error: ${String(err)}`);
      return false;
    };    
  };
  
  let lastFetchTime = 0;

  async function fetchToAuthenticate(singleResult){
    try {
      const currentTime = Date.now();
      const fetchCooldownTime = 3000;

      if (currentTime - lastFetchTime < fetchCooldownTime) {
        return;
      }; 
      lastFetchTime = currentTime;

      const res = await fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ singleResult, validEmail })
      });
      const data = await res.json();

      if (data.status === 200) {
        setUserValidate(true);
        Swal.fire({
          position: "center",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 4000
        });
      }else {
        if (descriptorsFaceDontMatch.length < 5) {
          descriptorsFaceDontMatch.push(data);
        } else{
          Swal.fire({
            position: "center",
            icon: "error",
            title: data.message,
            showConfirmButton: false,
            timer: 4000
          });
          setTimeout(() => {
            setLoginOrWebcam(false);
          }, 3000);
        };
      };
    } catch (error) {
      console.log(error);
    };
  };

  async function setupCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    if (!video || !canvas) return null;

    if (!navigator.mediaDevices) {
      console.log('Camera Error: access not supported');
      return null;
    };
    let stream;
    const constraints = { audio: false, video: { facingMode: 'user', resizeMode: 'crop-and-scale' } };

    if (window.innerWidth > window.innerHeight) constraints.video.width = { ideal: window.innerWidth };
    else constraints.video.height = { ideal: window.innerHeight };

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') log(`Camera Error: camera permission denied: ${err.message || err}`);
      if (err.name === 'SourceUnavailableError') log(`Camera Error: camera not available: ${err.message || err}`);
      return null;
    }

    if (stream) {
      video.srcObject = stream;
    } else {
      console.log('Camera Error: stream empty');
      return null;
    }
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    if (settings.deviceId) delete settings.deviceId;
    if (settings.groupId) delete settings.groupId;
    if (settings.aspectRatio) settings.aspectRatio = Math.trunc(100 * settings.aspectRatio) / 100;

    canvas.addEventListener('click', () => {
      if (video && video.readyState >= 2) {
        if (video.paused) {
          video.play();
          detectVideo(video, canvas);
        } else {
          video.pause();
        };
      };
    });

    return new Promise((resolve) => {
      video.onloadeddata = async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();
        detectVideo(video, canvas);
        resolve(true);
        setLoading(false);
      };
    });
  };  

  async function setupFaceAPI() {
    await faceapi.nets.ssdMobilenetv1.load(modelPath);
    await faceapi.nets.ageGenderNet.load(modelPath);
    await faceapi.nets.faceLandmark68Net.load(modelPath);
    await faceapi.nets.faceRecognitionNet.load(modelPath);
    await faceapi.nets.faceExpressionNet.load(modelPath);
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: minScore, maxResults });
  };

  async function main() {
    await faceapi.tf.setBackend('webgl');
    await faceapi.tf.ready();

    if (faceapi.tf?.env().flagRegistry.CANVAS2D_WILL_READ_FREQUENTLY) faceapi.tf.env().set('CANVAS2D_WILL_READ_FREQUENTLY', true);
    if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);
    if (faceapi.tf?.env().flagRegistry.WEBGL_EXP_CONV) faceapi.tf.env().set('WEBGL_EXP_CONV', true);

    await setupFaceAPI();
    await setupCamera();
  }

  return (
    <>
      <Loading loading={loading} />
      {!userValidate ? (
        <Container className='webcam-main-container' style={borderStyle}>
          <div className='webcam-container'>
            <video id="video" playsInline className="video" ref={videoRef}></video>
            <canvas id="canvas" className="canvas" ref={canvasRef}></canvas>
          </div>        
        </Container>
      ) : (
        <Welcome />
      )}
    </>
  );
};

export default Webcam;