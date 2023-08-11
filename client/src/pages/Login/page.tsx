import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button';
import { FaFacebookSquare, FaTwitterSquare, FaGoogle } from 'react-icons/fa';
import { Navigate, useNavigate } from '@tanstack/router';
import { loginWithCredentials, signupWithCredentials } from '@/api/user';
import logo from '@/assets/logo.svg';
import { appConstants } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { credentialsSchema, Credentials } from '@/types';

type PageVariant = 'login' | 'register';

export default function LoginPage() {
  const { user, setUserContext } = useAuth();
  const [pageVariant, setPageVariant] = useState<PageVariant>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { formState: { errors }, register, handleSubmit } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const navigate = useNavigate();

  if (user && !user.filledProfile) {
    return <Navigate to="/edit-profile" from="/" />;
  }

  if (user && user.filledProfile) {
    return <Navigate to="/app" from="/" />;
  }

  const onSubmit: SubmitHandler<Credentials> = async (data) => {
    try {
      if (pageVariant === 'login') {
        const res = await loginWithCredentials(data);
        if (res.status === "success") {
          navigate({ to: '/app', from: '/' })
        } else {
          setErrorMessage(res.error)
        }
      } else {
        await signupWithCredentials(data);
        const res = await loginWithCredentials(data);
        if (res.status === "success") {
          setUserContext(res.user)
          navigate({ to: '/edit-profile', from: '/' })
        } else {
          setErrorMessage(res.error)
        }
      }
    } catch (err) {

    }
  }

  // This is a redirect to the Google OAuth user consent screen.
  const handleGoogleLogin = () => {
    window.open(appConstants.googleOauthUrl, '_self');
  };

  // This is a redirect to the Facebook OAuth user consent screen.
  const handleFacebookLogin = () => {
    window.open(appConstants.facebookOauthUrl, '_self');
  };

  return (
    <div className="flex flex-col items-center w-full h-full sm:w-[30%] sm:h-[95%] bg-slate-50 rounded shadow shadow-gray-300 overflow-y-scroll no-scrollbar">
      <img src={logo} alt="logo" className="h-20 w-20" />
      <div className="flex flex-col items-center w-full mt-5">
        <h3 className="font-bold text-lg mb-8">
          {
            pageVariant === 'login' ? 'Sign in to your account' : 'Create an account'
          }
        </h3>
        {
          errorMessage.length > 0 && <p className="text-red-500 text-sm font-semibold"
            onBlur={() => setErrorMessage('')}
          >
            {errorMessage}
          </p>
        }
        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-start w-5/6">
            <label htmlFor="email" className="text-sm font-bold">
              Email
            </label>
            {errors.email && <p className="text-red-500 text-sm font-semibold">{errors.email.message}</p>}
            <input
              type="email"
              id="email"
              className="w-full h-10 border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              {...register('email')}
            />
          </div>
          <div className="flex flex-col items-start w-5/6 mt-5">
            <label htmlFor="password" className="text-sm font-bold">
              Password
            </label>
            {errors.password && <p className="text-red-500 text-sm font-semibold">{errors.password.message}</p>}
            <input
              type="password"
              id="password"
              className="w-full h-10 border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              {...register('password')}
            />
          </div>
          <Button
            variant="default"
            className="w-5/6 mt-5 bg-red-500 h-[46px] rounded-xl text-white font-bold hover:bg-red-600"
            type="submit"
          >
            {
              pageVariant === 'login' ? 'Sign in' : 'Sign up'
            }
          </Button>
        </form>
        <div className="flex items-center justify-between w-5/6 mt-5">
          <p>
            {
              pageVariant === 'login' ? 'Don\'t have an account?' : 'Already have an account?'
            }
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => setPageVariant(pageVariant === 'login' ? 'register' : 'login')}
            >
              {
                pageVariant === 'login' ? ' Sign up' : ' Sign in'
              }
            </span>
          </p>
        </div>
        <div className="mt-5 w-5/6">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-500"></div>
            <p className="mx-2">or continue with</p>
            <div className="flex-1 h-px bg-gray-500"></div>
          </div>
          <div className="flex justify-center mt-5 w-full">
            <div className="h-14 w-14 border border-gray-200 flex items-center justify-center rounded mx-5 cursor-pointer">
              <Button
                className='bg-inherit w-full h-full transform transition-transform hover:scale-110'
              >
                <FaGoogle className="text-4xl text-red-500" onClick={handleGoogleLogin} />
              </Button>
            </div>
            <div className="h-14 w-14 border border-gray-200 flex items-center justify-center rounded mx-5 cursor-pointer">
              <Button
                className='bg-inherit w-full h-full transform transition-transform hover:scale-110'
                onClick={handleFacebookLogin}
              >
                <FaFacebookSquare className="text-4xl text-red-500" />
              </Button>
            </div>
            <div className="h-14 w-14 border border-gray-200 flex items-center justify-center rounded mx-5 cursor-pointer">
              <Button className='bg-inherit w-full h-full  transform transition-transform hover:scale-110'>
                <FaTwitterSquare className="text-4xl text-red-500" />
              </Button>
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
