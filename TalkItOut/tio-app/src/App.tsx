import {BrowserRouter, Route, Routes} from 'react-router-dom';
import NotFound from './components/not-found';
import {UserRoutes} from './users/routes';
import {SessionRoutes} from './sessions/routes';
import Clients from './clients/clients-listing';
import {GoalRoutes} from './goals/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*">
          <Route index element={<UserRoutes />} />
          <Route path="sessions/*" element={<SessionRoutes />} />
          <Route path="clients/*" element={<Clients />} />
          <Route path="goals/*" element={<GoalRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
