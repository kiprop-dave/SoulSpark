import { Outlet, RouterProvider, RootRoute, Route, Router } from '@tanstack/router';
import { AuthProvider } from './context/AuthContext';
import { UserProfileProvider } from './context/UserProfileContext';
import LoginPage from './pages/Login/page';
import FillProfilePage from './pages/FillProfile/page';
import { AppPageLayout } from './pages/App/layout';
import AppPage from './pages/App/page';
import ProfilePage from './pages/App/Profile/page';
import { MatchesPage } from './pages/App/Matches/page';
import { MessagesPage } from './pages/App/Messages/page';
import AuthWrapper from './components/wrappers/AuthWrapper';

const rootRoute = new RootRoute({
  component: () => {
    return (
      <main className="w-screen h-screen flex items-center justify-center font-sans">
        <Outlet />
      </main>
    );
  },
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const fillProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/edit-profile',
  component: FillProfilePage,
});

const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: () => {
    return (
      <AuthWrapper>
        <AppPageLayout>
          <Outlet />
        </AppPageLayout>
      </AuthWrapper>
    );
  },
})

const appIndexRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/',
  component: AppPage,
});

const profileRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/profile',
  component: ProfilePage,
});

const matchesRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/likes',
  component: MatchesPage,
});

const messagesRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/messages',
  component: MessagesPage,
});

const appRouteTree = appRoute.addChildren([
  appIndexRoute,
  matchesRoute,
  messagesRoute,
  profileRoute
]);

const catchAllRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  fillProfileRoute,
  appRouteTree,
  catchAllRoute
]);

const router = new Router({ routeTree });

declare module '@tanstack/router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <AuthProvider>
        <UserProfileProvider>
          <RouterProvider router={router} />
        </UserProfileProvider>
      </AuthProvider>
    </>
  );
}

export default App;
