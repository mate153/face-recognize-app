import { Container, Form, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import './style/LoginComponent.css';

function LoginComponent() {
  const [singUp, setSingup] = useState(false)


  const handleSubmit = (e) => {
    e.preventDefault();
    // Sign in
  };

  return (
    !singUp ? 
      <Container className='login-container'>
        <div className="heading">Sign In</div>
        <Form onSubmit={handleSubmit} className="form">
          <Button type="submit" className="scan-button">Start scanning</Button>
        </Form>
        <div className="social-account-container">
          <span className="title"><a href="#" onClick={() => setSingup(true)}>Or Sign up</a></span>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </Container>
    :
      <Container className='login-container'>
        <div className="heading">Sign Up</div>
        <Form onSubmit={handleSubmit} className="form">
          <Button type="submit" className="scan-button">Start scanning</Button>
        </Form>
        <div className="social-account-container">
          <span className="title"><a href="#" onClick={() => setSingup(false)}>Or Sign in</a></span>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </Container>    
  );
};


export default LoginComponent