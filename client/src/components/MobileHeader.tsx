import logo from '@/assets/logo.svg';

export default function MobileHeader(): JSX.Element {
  return (
    <header className="md:hidden w-full h-12 px-2 py-1 flex items-center dark:bg-neutral-950">
      <img src={logo} alt="logo" className="w-8 h-8 mr-2" />
      <h1 className="text-2xl font-bold text-red-500">SoulSpark</h1>
    </header>
  );
}
