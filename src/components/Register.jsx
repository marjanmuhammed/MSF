import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import 'cropperjs/dist/cropper.css';


function Register() {
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [combinedImage, setCombinedImage] = useState(null);
  const [showSourceOptions, setShowSourceOptions] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const MSF_LOGO_URL = "https://media-hosting.imagekit.io/2e9b026922d84071/ca2dc57d-8705-4275-9d8f-6f0e3660de78.jpeg?Expires=1841978130&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=HsBsvslchOYpSO2ZSHXjDGbgLs0cC6c~NywowSg37QRgZ9Ri73P2091~a4FaWmuFXH5y7c-u78MvF-NoTLn6PtbY7URtvYoNkzYi1MgH6dgI0MIMaUmmbLeI06q3wn93P2hu3bhVTh1kFVBwOq9hJJ1y7IdM7jPv-BqfjngKRlWrOmtMVCQ8PocGW4Q5pfjXzJaffz~eWeJZ2Dp5Ml0A62dpCdmLdpoRvfP5m~CUK0xarKm3ubz1hJsoheF8bGhM9MNUFcTczL5hu~OtfaI4i5KXs73j9qCN4fp5xI7Q1TqkfucYFqwF~xu2EAxQyjBwZC9~AOnOmtABT9sCfyoRFw__";

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
          const userImgWidth = 600;
          const userImgHeight = 670;

          const x = canvas.width / 2 - userImgWidth / 2 + 0;
          const y = canvas.height / 2 - userImgHeight / 2 - 300;

          function roundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
          }

          ctx.save();
          const radius = 60;
          roundRect(ctx, x, y, userImgWidth, userImgHeight, radius);
          ctx.clip();

          ctx.drawImage(userImg, x, y, userImgWidth, userImgHeight);
          ctx.restore();

          ctx.font = 'bold 60px Arial';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(243, 156, 18, 0.8)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.fillText(formData.name, x + userImgWidth / 2, y + userImgHeight + 70);

          const combined = canvas.toDataURL('image/jpeg');
          resolve(combined);
        };

        userImg.onerror = () => {
          toast.error("Failed to load user image");
          resolve(userImage);
        };
      };

      msfLogo.onerror = () => {
        toast.error("Failed to load MSF logo image");
        resolve(userImage);
      };
    });
  };

  const handleImageSelection = (sourceType) => {
    setShowSourceOptions(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.ref = fileInputRef;

    if (sourceType === 'camera') {
      input.capture = 'environment';
    }

    input.onchange = (e) => handleImageUpload(e);
    input.click();
  };

  const handleImageUpload = async (e) => {
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

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (img) => {
    imgRef.current = img;
    // Set initial crop to center square
    const size = Math.min(img.width, img.height) * 0.8;
    const x = (img.width - size) / 2;
    const y = (img.height - size) / 2;
    
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x,
      y
    });
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    setIsUploading(true);
    try {
      const croppedImage = await getCroppedImg();
      setFormData({ ...formData, image: croppedImage });
      setUploadedImage(croppedImage);

      const combined = await combineImages(croppedImage);
      setCombinedImage(combined);
      toast.success("Image cropped and uploaded successfully");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Error processing image");
    } finally {
      setIsUploading(false);
      setShowCropModal(false);
    }
  };
  const handleDownload = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }
  
    // Regenerate combined image freshly
    const finalImage = await combineImages(uploadedImage);
  
    const link = document.createElement("a");
    link.download = `${formData.name || "registration"}.png`;
    link.href = finalImage;  // <-- Use the string directly, no toDataURL()
    link.click();
  };
  
  return (
    <div className={`w-full max-w-md mx-auto ${isMobile ? 'p-3' : 'p-6'} bg-white rounded-lg shadow-lg mt-6 border border-gray-300`}>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="text-center mb-6">
        <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-800`}>
          MSF MAYYIL PANCHAYATH
        </h1>
        <h2 className={`${isMobile ? 'text-md' : 'text-xl'} font-extrabold mt-1 animate-blinkText`}>
          Registration Form
        </h2>
      </div>

      {uploadedImage && (
        <div className="mb-4 flex flex-col items-center">
          <div className="flex justify-center">
            <img 
              src={combinedImage || uploadedImage}
              alt="Preview"
              className={`${isMobile ? 'h-32 w-32' : 'h-48 w-48'} object-cover border-4 border-green-500 rounded-md`} 
            />
          </div>
          <p className="text-sm text-green-600 mt-2">Image selected ✓</p>
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
          <label 
            onClick={() => setShowSourceOptions(true)}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {formData.image ? (
              <>
                <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
                <p className="text-xs text-green-600">Click to change image</p>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5 5 0 1116 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-500 text-center">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-400">PNG, JPG (Max: 5MB)</p>
              </>
            )}
          </label>
        </div>

        {showSourceOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-64">
              <h3 className="text-lg font-semibold mb-4">Select Image Source</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleImageSelection('camera')}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Take Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleImageSelection('gallery')}
                  className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Choose from Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setShowSourceOptions(false)}
                  className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCropModal && originalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Crop Your Image</h3>
              <div className="mb-4" style={{ maxHeight: '60vh', overflow: 'auto' }}>
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={200}
                  minHeight={200}
                >
                  <img
                    ref={imgRef}
                    src={originalImage}
                    onLoad={(e) => onImageLoad(e.currentTarget)}
                    alt="Crop preview"
                    style={{ maxWidth: '100%' }}
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={isUploading}
                >
                  {isUploading ? 'Processing...' : 'Apply Crop'}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={isUploading || !uploadedImage || !formData.name.trim()}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            (isUploading || !uploadedImage || !formData.name.trim()) 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isUploading ? "Processing..." : "Download Image"}
        </button>
      </form>
    </div>
  );
}

export default Register;