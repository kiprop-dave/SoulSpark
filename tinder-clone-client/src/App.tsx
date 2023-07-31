import { Outlet, RouterProvider, RootRoute, Route, Router } from '@tanstack/router';
import LoginPage from './pages/Login/page';

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

const catchAllRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: LoginPage
});

const routeTree = rootRoute.addChildren([
  loginRoute,
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
      <RouterProvider router={router} />
    </>
  )
}

export default App
