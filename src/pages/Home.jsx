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
          <div className="relative group">
          <p className="text-gray-700 font-[Noto_Sans_Malayalam] mt-1 transition-all duration-300
  group-hover:text-green-700 group-focus-within:text-green-700
  group-hover:scale-105 group-focus-within:scale-105
  ">
  msf മയ്യിൽ പഞ്ചായത്ത്‌ സമ്മേളനം
  <span className="ml-2 inline-block transition-transform duration-500
    group-hover:rotate-45 group-focus-within:rotate-45
  ">🎉</span>
</p>
<p className="text-gray-600 font-[Noto_Sans_Malayalam] transition-all duration-500
  hover:text-amber-600 hover:font-bold focus:text-amber-600 focus:font-bold
">
  2025 മെയ് 17,18
</p>

  <div className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 w-0 group-hover:w-full transition-all duration-500"></div>
</div>
        </div>
      </div>

      {/* Registration Button */}
      <div className="mt-8 w-full max-w-[140px] mx-auto">
  <button
    onClick={() => navigate("/register")}
    className="group w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium text-sm md:text-base py-2.5 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
  >
    <span className="mr-1">Create</span> {/* Reduced right margin */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
</div>

        
    </div>
  );
}

export default Home;
