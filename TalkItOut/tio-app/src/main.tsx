import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import {TamaguiProvider} from 'tamagui';
import config from '../tamagui.config';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TamaguiProvider config={config}>
    <App />
  </TamaguiProvider>
);
