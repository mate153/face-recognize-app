import { Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Webcam from "./components/WebcamComponent.jsx";
import Login from "./components/LoginComponent.jsx";
import './App.css';

function App() {
  const [validEmail, setValidEmail] = useState(null);

  const checkValidEmail = (email) => {
    setValidEmail(email);
  }

  useEffect(() => {
    const fetcingData = async() => {
      try{
        const res = await fetch('/api/test');
        const data = await res.json();
        console.log(data);
      }catch (err){
        console.log(err);
      }
    }
    fetcingData();
  }, [])

  console.log(validEmail);

  return (
    <Container className='main-container bg-dark mt-auto d-flex justify-content-center align-items-center' fluid>
      {validEmail != null ? 
      <Webcam />
      :
      <Login checkValidEmail={checkValidEmail} />}
    </Container>
  )
}

export default App
