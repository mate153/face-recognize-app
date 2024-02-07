import React, { useEffect, useRef, useState } from 'react';
import { Container, Image } from 'react-bootstrap';
import noCameraImage from '/images/no-connected-camera.jpg';
import './style/WebcamComponent.css';

function Webcam() {
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraAvailable(true);
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setCameraAvailable(false);
      }
    };

    enableWebcam();

    return () => {
      //Stop the webcam
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []);

  return (
    <Container className='webcam-container'>
        <div className='content' style={{ display: cameraAvailable ? 'block' : 'none'}}>
          <video ref={videoRef} autoPlay muted />
        </div>
        <div className='content' style={{ display: !cameraAvailable ? 'block' : 'none'}}>
          <Image src={noCameraImage} alt="No camera available" />
        </div>
    </Container>
  );
}

export default Webcam;