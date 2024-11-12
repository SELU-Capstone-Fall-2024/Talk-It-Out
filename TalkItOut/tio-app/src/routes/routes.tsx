import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ClientRoutes} from '../clients/routes';
import MyCalendar from '../components/calendar';
import Home from '../components/home';
import Login from '../components/login';
import Logout from '../components/logout';
import Navbar from '../components/nav-bar';
import NotFound from '../components/not-found';
import {GoalRoutes} from '../goals/routes';
import {GroupRoutes} from '../groups/routes';
import {SessionRoutes} from '../sessions/routes';
import {UserRoutes} from '../users/routes';
import {useAuth} from '../auth/auth-context';

export const BrowserRoutes: React.FC = () => {
  const {user} = useAuth();
  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        <Route path="/*">
          <Route index element={<Login />} />
          <Route path="sessions/*" element={<SessionRoutes />} />
          <Route path="calendar" element={<MyCalendar />} />
          <Route path="clients/*" element={<ClientRoutes />} />
          <Route path="goals/*" element={<GoalRoutes />} />
          <Route path="groups/*" element={<GroupRoutes />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="users/*" element={<UserRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
