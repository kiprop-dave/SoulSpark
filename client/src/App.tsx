import { Suspense, lazy } from 'react';
import { Outlet, RouterProvider, RootRoute, Route, Router } from '@tanstack/router';
import { AuthProvider } from './context/AuthContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PossibleMatchesProvider } from './context/PossibleMatchesContext';
import Spinner from './components/Spinner';
import LoginPage from './pages/Login/page';
import AppPageLayout from './pages/App/layout';
import AuthWrapper from './components/wrappers/AuthWrapper';
import MobileHeader from './components/MobileHeader';
const FillProfilePage = lazy(() => import('./pages/FillProfile/page'));
const AppPage = lazy(() => import('./pages/App/page'));
const ProfilePage = lazy(() => import('./pages/App/Profile/page'));
const LikesPage = lazy(() => import('./pages/App/Likes/page'));
const MessagesPage = lazy(() => import('./pages/App/Messages/page'));
const ConversationPage = lazy(() => import('./pages/App/Messages/[conversationId]/page'));

const rootRoute = new RootRoute({
  component: () => {
    const { theme } = useTheme();
    return (
      <main
        className={`w-screen h-screen flex items-center delay-100 justify-center font-sans ${theme}`}
      >
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
  component: () => {
    return (
      <Suspense fallback={<Spinner size="md" />}>
        <FillProfilePage />
      </Suspense>
    );
  },
});

const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: () => {
    return (
      <AuthWrapper>
        <AppPageLayout>
          <PossibleMatchesProvider>
            <Outlet />
          </PossibleMatchesProvider>
        </AppPageLayout>
      </AuthWrapper>
    );
  },
});

const appIndexRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/',
  component: () => {
    return (
      <>
        <MobileHeader />
        <Suspense fallback={<Spinner size="md" />}>
          <AppPage />
        </Suspense>
      </>
    );
  },
});

const profileRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/profile',
  component: () => {
    return (
      <>
        <MobileHeader />
        <Suspense fallback={<Spinner size="md" />}>
          <ProfilePage />
        </Suspense>
      </>
    );
  },
});

const likesRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/likes',
  component: () => {
    return (
      <Suspense fallback={<Spinner size="md" />}>
        <LikesPage />
      </Suspense>
    );
  },
});

const messagesIndexRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/messages',
  component: () => {
    return (
      <>
        <Outlet />
      </>
    );
  },
});

const messagesRoute = new Route({
  getParentRoute: () => messagesIndexRoute,
  path: '/',
  component: () => {
    return (
      <>
        <MobileHeader />
        <Suspense fallback={<Spinner size="md" />}>
          <MessagesPage />
        </Suspense>
      </>
    );
  },
});

const conversationRoute = new Route({
  getParentRoute: () => messagesIndexRoute,
  path: '$conversationId',
  component: () => {
    return (
      <Suspense fallback={<Spinner size="md" />}>
        <ConversationPage />
      </Suspense>
    );
  },
});

const appRouteTree = appRoute.addChildren([
  appIndexRoute,
  likesRoute,
  messagesIndexRoute.addChildren([messagesRoute, conversationRoute]),
  profileRoute,
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
  catchAllRoute,
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
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </UserProfileProvider>
      </AuthProvider>
    </>
  );
}

export default App;
