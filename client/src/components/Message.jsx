import React from 'react';
import './style/Message.css';

const Message = ({ messageCurrentText, showMessage }) => {
    let icon;

    if (messageCurrentText === "Searching...") {
        icon = <i className="fa-brands fa-searchengin icon" style={{color: "blue"}}></i>;
    } else if ( messageCurrentText === "Please face the camera until the frame turns green!"){
        icon = <i className="fa-regular fa-circle-xmark icon" style={{color: "red"}}></i>;
    } else {
        icon = <i className="fa-regular fa-circle-check icon" style={{color: "green"}}></i>;
    }

    return (
        <div className="message-container" style={{ display: showMessage ? 'flex' : 'none' }}>
            {icon}
            <span className="message">{messageCurrentText}</span>
        </div>
    );
};

export default Message;