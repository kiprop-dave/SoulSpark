import { Outlet, RouterProvider, RootRoute, Route, Router } from '@tanstack/router';
import LoginPage from './pages/Login/page';
import FillProfilePage from './pages/FillProfile/page';
import { AuthProvider } from './context/AuthContext';

const rootRoute = new RootRoute({
  component: () => {
    return (
      <main className='w-screen h-screen flex items-center justify-center font-sans'>
        <Outlet />
      </main>
    )
  }
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage
});

const fillProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/fill-profile',
  component: FillProfilePage
});

const catchAllRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: LoginPage
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  fillProfileRoute,
  catchAllRoute
]);

const router = new Router({ routeTree });

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
};

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
