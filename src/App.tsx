import { AppProvider, useApp } from './AppContext';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { SwipeScreen } from './screens/SwipeScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { PricingScreen } from './screens/PricingScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProfileViewScreen } from './screens/ProfileViewScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ListingScreen } from './screens/ListingScreen';

const FULLSCREEN_SCREENS = ['auth', 'onboarding'];
const NO_FOOTER_SCREENS = ['chat', 'messages'];

function Router() {
  const { screen } = useApp();

  const render = () => {
    switch (screen) {
      case 'home': return <HomeScreen />;
      case 'auth': return <AuthScreen />;
      case 'onboarding': return <OnboardingScreen />;
      case 'discover': return <DiscoverScreen />;
      case 'swipe': return <SwipeScreen />;
      case 'services': return <ServicesScreen />;
      case 'products': return <ProductsScreen />;
      case 'search': return <SearchScreen />;
      case 'pricing': return <PricingScreen />;
      case 'messages': return <MessagesScreen />;
      case 'chat': return <ChatScreen />;
      case 'profile': return <ProfileScreen />;
      case 'profileView': return <ProfileViewScreen />;
      case 'dashboard': return <DashboardScreen />;
      case 'listing': return <ListingScreen />;
      default: return <HomeScreen />;
    }
  };

  const isFullscreen = FULLSCREEN_SCREENS.includes(screen);
  const showFooter = !FULLSCREEN_SCREENS.includes(screen) && !NO_FOOTER_SCREENS.includes(screen);

  if (isFullscreen) {
    return (
      <div key={screen} className="animate-fade-in">
        {render()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <Sidebar />
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <main key={screen} className="flex-1 animate-fade-in main-scroll">
          {render()}
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
