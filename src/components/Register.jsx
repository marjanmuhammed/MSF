import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [combinedImage, setCombinedImage] = useState(null);

  const MSF_LOGO_URL = "https://media-hosting.imagekit.io/6c5eba5d0cd94d13/5948e25f-7f67-4eb5-8889-ccff3e0211a7-Photoroom%20(1).png?Expires=1841751769&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tD6yF3S6g1zwHAM3L9rzGtN0T9QOuVqMSneQoJd1KxxRpIXvmEzhtfbkwRBpNhO125SPhr2x6BBaD7-~RlH8n3O7t2je79Zu8B7fT5IrcJyolE3fbLruNbWNQ5ZM0By1WsBqnCb7uuhHRBcoukWSKbkNV60PXGjxtIvqztXNwDNTTmLh2ylHrLsG3t1fj9cra9psXbcrH4nHq0qCjrQWlUtBDYHOh8l11Z4yKLo3q6PpnbefneEjVyUocJuu7Gjbodi7YGmUN6pQSh6LL2R2mLkT9hw9uQuDqn9ysih37sMTH5q6yfH96CcDlZSnO4Mbv48DHrB2yEGlcqG51rd37w__";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const combineImages = async (userImage) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const msfLogo = new Image();
      msfLogo.crossOrigin = "Anonymous";
      msfLogo.src = MSF_LOGO_URL;

      msfLogo.onload = () => {
        canvas.width = msfLogo.width;
        canvas.height = msfLogo.height;

        ctx.drawImage(msfLogo, 0, 0);

        const userImg = new Image();
        userImg.src = userImage;

        userImg.onload = () => {
          const userImgSize = 260;
          const x = canvas.width / 2 - userImgSize / 2 - 220;
          const y = canvas.height / 2 - userImgSize / 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(x + userImgSize / 2, y + userImgSize / 2, userImgSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(userImg, x, y, userImgSize, userImgSize);
          ctx.restore();

          ctx.font = 'bold 26px Arial';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(formData.name, x + userImgSize / 2, y + userImgSize + 60);

          const combined = canvas.toDataURL('image/jpeg');
          resolve(combined);
        };
      };
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select a valid image file (JPEG, PNG)');
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter your name before uploading image.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result;
      setFormData({ ...formData, image: imageData });
      setUploadedImage(imageData);

      try {
        const combined = await combineImages(imageData);
        setCombinedImage(combined);
      } catch (error) {
        console.error("Error combining images:", error);
        setCombinedImage(imageData);
      }

      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    const imageToDownload = combinedImage || uploadedImage;
    const link = document.createElement('a');
    link.href = imageToDownload;
    link.download = `msf_${formData.name || 'user'}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${isMobile ? 'p-3' : 'p-6'} bg-white rounded-lg shadow-lg mt-6 border border-gray-300`}>
      <ToastContainer position="top-center" />

      <div className="text-center mb-6">
        <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-800`}>MSF MAYYIL PANCHAYATH</h1>
        <h2 className={`${isMobile ? 'text-md' : 'text-xl'} font-semibold mt-1`}>Registration Form</h2>
      </div>

      {uploadedImage && (
        <div className="mb-4 flex flex-col items-center">
          <div className="flex justify-center">
            <img 
              src={combinedImage || uploadedImage}
              alt="Preview"
              className={`${isMobile ? 'h-32 w-32' : 'h-48 w-48'} object-cover rounded-full border-4 border-green-500`} 
            />
          </div>
        </div>
      )}

      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Upload Photo</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
            {formData.image ? (
              <>
                <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
                <p className="text-xs text-green-600">Image Selected</p>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5 5 0 1116 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-500 text-center">
                  <span className="font-semibold">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG (Max: 5MB)</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
              capture="environment"
              required
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isUploading || !uploadedImage || !formData.name.trim()}
          className={`w-full py-3 rounded-lg text-white font-medium ${(isUploading || !uploadedImage || !formData.name.trim()) ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
        >
          {isUploading ? "Processing..." : "Download Image"}
        </button>
      </form>
    </div>
  );
}

export default Register;
