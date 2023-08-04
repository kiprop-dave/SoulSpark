import { Button } from '@/components/ui/button';
import { FaFacebookSquare, FaTwitterSquare } from 'react-icons/fa';
import { Navigate } from '@tanstack/router';
import logo from '@/assets/logo.svg';
import { appConstants } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';

//type PageVariant = 'login' | 'register';

export default function LoginPage() {
  const { user } = useAuth();

  if (user && !user.filledProfile) {
    return <Navigate to="/fill-profile" from="/" />;
  }

  // This is a redirect to the Google OAuth user consent screen.
  const handleGoogleLogin = () => {
    window.open(appConstants.googleOauthUrl, '_self');
  };

  return (
    <div className="flex flex-col items-center w-full h-full sm:w-[30%] sm:h-[95%] bg-slate-50 rounded shadow shadow-gray-300">
      <img src={logo} alt="logo" className="h-20 w-20" />
      <div className="flex flex-col items-center w-full mt-5">
        <h3 className="font-bold text-lg mb-8">Sign in to your account</h3>
        <Button
          variant="default"
          className="w-5/6 mb-5 bg-red-500 h-[46px] rounded-xl text-white font-bold hover:opacity-95 hover:bg-red-500"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        <div className="mt-20 w-5/6">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-500"></div>
            <p className="mx-2">or continue with</p>
            <div className="flex-1 h-px bg-gray-500"></div>
          </div>
          <div className="flex justify-center mt-5 w-full">
            <div className="h-14 w-14 border border-gray-200 flex items-center justify-center rounded mx-5 cursor-pointer">
              <FaFacebookSquare className="text-4xl text-red-500" />
            </div>
            <div className="h-14 w-14 border border-gray-200 flex items-center justify-center rounded mx-5 cursor-pointer">
              <FaTwitterSquare className="text-4xl text-red-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-evenly w-5/6 mt-20">
          <p className="text-red-500">Terms of use</p>
          <p className="text-red-500">Privacy policy</p>
        </div>
      </div>
    </div>
  );
}
