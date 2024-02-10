import { Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Webcam from "./components/WebcamComponent.jsx";
import Login from "./components/LoginComponent.jsx";
import './App.css';

function App() {
  const [validEmail, setValidEmail] = useState(null);
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);

  const checkValidEmail = (email) => {
    setValidEmail(email);
  }

  const checkRegister = (bool) => {
    setRegister(bool);
  }

  const setLoginTrue = (bool) => {
    setLogin(bool)
  }

  return (
    <Container className='main-container bg-dark mt-auto d-flex justify-content-center align-items-center' fluid>
      {validEmail != null ?
      <section id='webcam-component'>
        <Webcam register={register} setLoginTrue={setLoginTrue} login={login}/>
      </section> 
      :
      <section id='login-component'>
        <Login checkValidEmail={checkValidEmail} register={register} checkRegister={checkRegister} />
      </section>}
    </Container>
  )
};

export default App;
