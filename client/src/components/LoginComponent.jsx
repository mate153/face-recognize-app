import { Container, Form, Button } from 'react-bootstrap';
import { object, string } from 'yup';
import React, { useState } from 'react';
import './style/LoginComponent.css';

let userSchema = object({
  email: string().email().required()
});

function LoginComponent({checkValidEmail}) {
  const [singUp, setSingup] = useState(false);
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleFocus = () => {
    setTouched(true);
  };

  const validateEmail = async () => {
    try {
      await userSchema.validate({ email });
      setIsEmailValid(true);
      console.log('Email valid');
    } catch (err) {
      setIsEmailValid(false);
      console.error('Email not valid:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await validateEmail();
    if (isEmailValid) {
      console.log('Form submitted');
      checkValidEmail(email);
    }
  };

  return (
    !singUp ? 
      <Container className='login-container'>
        <div className="heading">Sign In</div>
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="E-mail"
            required
            className={`input ${touched && !isEmailValid ? 'invalid-email' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            onBlur={validateEmail}
            isInvalid={touched && !isEmailValid} 
          />
        </Form.Group>
        <Form className="form">
          <Button
            id='sign-in-btn'
            className="scan-button"
            onClick={(e) => handleSubmit(e)}
            disabled={!isEmailValid}
          >
            Start scanning
          </Button>
        </Form>
        <div className="social-account-container">
          <span className="title"><a href="#" onClick={() => setSingup(true)}>Or Sign up</a></span>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </Container>
    :
      <Container className='login-container'>
        <div className="heading">Sign Up</div>
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="E-mail"
            required
            className={`input ${touched && !isEmailValid ? 'invalid-email' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            onBlur={validateEmail}
            isInvalid={touched && !isEmailValid} 
          />
        </Form.Group>
        <Form className="form">
          <Button
            id='sign-up-btn'
            className="scan-button"
            onClick={(e) => handleSubmit(e)}
            disabled={!isEmailValid}
          >
            Start scanning
          </Button>
        </Form>
        <div className="social-account-container">
          <span className="title"><a href="#" onClick={() => setSingup(false)}>Or Sign in</a></span>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </Container>    
  );
};

export default LoginComponent;
