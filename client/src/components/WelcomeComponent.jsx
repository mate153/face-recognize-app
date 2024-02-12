import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

function WelcomeComponent() {
  useEffect(() => {
    setTimeout(() => {
      Swal.fire({
        title: "Please rate the process!",
        icon: "question",
        input: "range",
        inputLabel: "How satisfied are you with the login?",
        inputAttributes: {
          min: "0",
          max: "10",
          step: "1"
        },
        inputValue: 5
      });
    }, 4000);
  }, []);  
  return (
    <>
      <div style={{color: 'white'}}>Welcome</div>
    </>
  );
};

export default WelcomeComponent