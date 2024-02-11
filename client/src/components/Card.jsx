import React from 'react';
import './style/Card.css';

function Card({isHidden, handleSetIsHidden, register, setLoginOrWebcam}) {

    const handleBackButton = () => {
        handleSetIsHidden(false);
        setLoginOrWebcam(false);
    };

    return (
        <div className="cookieCard" style={{display: isHidden ? 'flex' : 'none'}}>
            <p className="cookieDescription">
              {register ? "Registration Succesfull!" : "Authentication Succesfull!"}
            </p>
            {register && <button className="acceptButton" onClick={() => handleBackButton()}>Back to login</button>}
        </div>
      )
};

export default Card;