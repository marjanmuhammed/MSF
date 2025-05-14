import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Trigger animation on mount
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4 md:p-8 pt-10 md:pt-20 overflow-x-hidden">
      {/* Image and texts container with animation */}
      <div
        className={`transform transition-all duration-1000 ease-out ${
          animate ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        } w-full max-w-md md:max-w-2xl mx-auto bg-white p-2 md:p-4 rounded-lg shadow-lg`}
      >
        {/* Vijayashamsakal Top Text */}
        <div className="text-center font-bold text-green-700 text-xl md:text-2xl mb-2 font-[Noto_Sans_Malayalam]">
          വിജയാശംസകൾ
        </div>

        {/* Main Image */}
        <img
          src="https://media-hosting.imagekit.io/d998aabf48f94b5e/IMG_5782.JPG?Expires=1841743273&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=USoNcavhlbJumNyemqJCOz-dq0Rt5AYbo30oHLxLeky7IwaW0-sk-PniUTiISFFYEoWUAC99iZDlzX14B8-pj1w9ddM6dXDH-cnn-ecOzVCqUwWOg8ZQmKGeDvhsIKjcNKEYIP4m12b80q25s9w~MU7tM7tF99w5kylWQTAiqjJtlPCpIz5GsFI97hK3-ivEr3CdeP1kKBOnhGSq7YF9ZVIGOybykMdvQE3iDadw5mrYXsE8zcN2bko~Gs7toddFUB3IoDb7K866w78XRDWsiG7ZqX0jFH4cOiUr5r0vJMkpIoC5Ji4osU06WFk8CvdLnec2YuHLjQBGRFMHS9KHBQ__"
          alt="Notice"
          className="w-full h-auto rounded border border-gray-300"
        />

        {/* Malayalam Quote & Info */}
        <div className="text-center mt-4">
          <p className="text-green-800 text-lg font-semibold font-[Noto_Sans_Malayalam]">
            “ഐക്യം… അതിജീവനം… അഭിമാനം…”
          </p>
          <p className="text-gray-700 font-[Noto_Sans_Malayalam] mt-1">
            msf മയ്യിൽ പഞ്ചായത്ത്‌ സമ്മേളനം
          </p>
          <p className="text-gray-600 font-[Noto_Sans_Malayalam]">
            2025 മെയ് 17,18
          </p>
        </div>
      </div>

      {/* Registration Button */}
     {/* Registration Button */}
<div className="mt-6 w-full max-w-xs md:max-w-sm">
  <button
    onClick={() => navigate("/register")}
    className="w-full bg-green-500 hover:bg-green-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-8 rounded-full transition-colors duration-300 shadow-md"
  >
    Registration Form
  </button>
</div>

        
    </div>
  );
}

export default Home;
