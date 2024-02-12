import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import Webcam from "./components/WebcamComponent.jsx";
import Login from "./components/LoginComponent.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [validEmail, setValidEmail] = useState(null);
  const [loginOrWebcam, setLoginOrWebcam] = useState(false);
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false); 

  const checkValidEmail = (email) => {
    setValidEmail(email);
  };

  const checkRegister = (bool) => {
    setRegister(bool);
  };

  const setLoginTrue = (bool) => {
    setLogin(bool)
  };

  return (
    <Container className='main-container bg-dark mt-auto d-flex justify-content-center align-items-center' fluid>
      {loginOrWebcam ?
      <Webcam register={register} login={login} setLoginOrWebcam={setLoginOrWebcam} validEmail={validEmail}/>
      :
      <Login checkValidEmail={checkValidEmail} register={register} checkRegister={checkRegister} setLoginOrWebcam={setLoginOrWebcam} setLoginTrue={setLoginTrue} />}
    </Container>
  )
};

export default App;
