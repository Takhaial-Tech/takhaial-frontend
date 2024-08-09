import React from 'react';
import './LoadingScreen.css'

const LoadingScreen = ({ isAbsolute }) =>
{
    return (
        <div className={`loading-screen`} style={{ position: isAbsolute ? 'absolute' : 'fixed' }} >
            <div className="loading-spinner"></div>
        </div>
    );
};

export default LoadingScreen;
