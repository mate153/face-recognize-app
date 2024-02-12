import React, { useState, useEffect } from 'react';
import './style/Slider.css';
import { Container } from 'react-bootstrap';

const Slider = ({ currentYaw }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(currentYaw);
  }, [currentYaw]);

  return (
    <Container className='slider-container d-flex flex-column align-items-center'>
      <input
        type="range"
        min="-200"
        max="200"
        step="1"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Face Direction: {Math.round(value)}</p>
    </Container>
  );
};

export default Slider;