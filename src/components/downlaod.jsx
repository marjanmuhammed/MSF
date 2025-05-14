import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function DownloadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, name, phone } = location.state || {}; // Get passed state if any

  const handleDownload = () => {
    const imageToDownload = image;
    if (imageToDownload) {
      const link = document.createElement('a');
      link.href = imageToDownload;
      link.download = `msf_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg mt-6 border border-gray-300">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Download Your Image</h1>
        <h2 className="text-xl font-semibold mt-1">Your Image is Ready</h2>
      </div>

      {image ? (
        <div className="flex flex-col items-center">
          <img src={image} alt="Preview" className="w-48 h-48 object-cover rounded-md mb-4" />
          <p className="text-lg font-semibold">Name: {name}</p>
          <p className="text-sm text-gray-600">Phone: {phone}</p>

          <button
            onClick={handleDownload}
            className="mt-4 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download Image
          </button>
        </div>
      ) : (
        <p className="text-center text-red-600 mt-4">No image found!</p>
      )}

      <button
        onClick={goBack}
        className="mt-6 py-3 px-6 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

export default DownloadPage;
