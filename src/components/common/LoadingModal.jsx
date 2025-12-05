import React from 'react';


const LoadingModal = () => {
    console.log('LoadingModal');
    return (
        <div className="loading-backdrop">
            <div className="loading-spinner">
                <div className="spinner-animation"></div>
                <p>Memuat Katalog Film...</p>
            </div>
        </div>
    );
};

export default LoadingModal;