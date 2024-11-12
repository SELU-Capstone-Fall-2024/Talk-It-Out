import {TamaguiProvider} from 'tamagui';
import config from '../tamagui.config';
import {AuthProvider} from './auth/auth-context';
import {BrowserRoutes} from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <TamaguiProvider config={config}>
        <BrowserRoutes />
      </TamaguiProvider>
    </AuthProvider>
  );
}

export default App;
