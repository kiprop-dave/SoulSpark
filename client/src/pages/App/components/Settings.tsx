import { BsCheck } from 'react-icons/bs';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export function Settings(): JSX.Element {
  const { switchTheme, theme } = useTheme();
  const { logoutUser } = useAuth();
  return (
    <div className="w-full h-full">
      <div className="w-full">
        <div className="w-full h-16 flex items-end px-2 pt-4 pb-2 border-b border-b-slate-300 dark:border-b-gray-700">
          <h2 className="font-semibold text-slate-600 dark:text-gray-500">App Theme</h2>
        </div>
        <div className="w-full h-14 flex items-center px-2 bg-white border-b border-b-slate-300 dark:border-b-gray-700 dark:bg-neutral-800">
          <button
            type="button"
            aria-label="Light Mode"
            className="w-full h-full flex items-center justify-between"
            onClick={() => switchTheme('light')}
          >
            <span className="text-slate-700 text-sm dark:text-white">Light Mode</span>
            {theme === 'light' && <BsCheck className="text-red-500 text-3xl" />}
          </button>
        </div>
        <div className="w-full h-14 flex items-center bg-white px-2 border-b border-b-slate-300 dark:border-b-gray-700 dark:bg-neutral-800">
          <button
            type="button"
            aria-label="Dark Mode"
            className="w-full h-full flex items-center justify-between"
            onClick={() => switchTheme('dark')}
          >
            <span className="text-slate-700 text-sm dark:text-white">Dark Mode</span>
            {theme === 'dark' && <BsCheck className="text-red-500 text-3xl" />}
          </button>
        </div>
      </div>
      <button
        className="w-full my-4 h-14 flex items-center justify-center text-slate-700 dark:text-white bg-white dark:bg-neutral-800 border-y border-slate-300 dark:border-gray-700"
        onClick={logoutUser}
      >
        Logout
      </button>
    </div>
  );
}
