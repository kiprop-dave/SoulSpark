import { Outlet, RouterProvider, RootRoute, Route, Router } from '@tanstack/router';
import { AuthProvider } from './context/AuthContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PossibleMatchesProvider } from './context/PossibleMatchesContext';
import LoginPage from './pages/Login/page';
import FillProfilePage from './pages/FillProfile/page';
import { AppPageLayout } from './pages/App/layout';
import AppPage from './pages/App/page';
import ProfilePage from './pages/App/Profile/page';
import LikesPage from './pages/App/Likes/page';
import { MessagesPage } from './pages/App/Messages/page';
import { ConversationPage } from './pages/App/Messages/[conversationId]';
import AuthWrapper from './components/wrappers/AuthWrapper';

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
  component: FillProfilePage,
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
  component: LikesPage,
});

const messagesIndexRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/messages',
  component: () => {
    return (
      <>
        <Outlet />
      </>
    )
  },
});

const messagesRoute = new Route({
  getParentRoute: () => messagesIndexRoute,
  path: '/',
  component: MessagesPage,
});

const conversationRoute = new Route({
  getParentRoute: () => messagesIndexRoute,
  path: '$conversationId',
  component: ConversationPage,
});

const appRouteTree = appRoute.addChildren([
  appIndexRoute,
  matchesRoute,
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
