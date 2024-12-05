import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ClientRoutes} from '../clients/routes';
import CalendarMonth from '../components/calendar-month';
import Home from '../components/home';
import Login from '../components/login';
import Logout from '../components/logout';
import NotFound from '../components/not-found';
import {GoalRoutes} from '../goals/routes';
import {GroupRoutes} from '../groups/routes';
import {SessionRoutes} from '../sessions/routes';
import {UserRoutes} from '../users/routes';
import Header from '../components/header';
import CalendarWeek from '../components/calendar-week';
import {TodaySessions} from '../sessions/today-sessions';

export const BrowserRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/*">
          <Route index element={<Login />} />
          <Route path="home" element={<TodaySessions />} />
          <Route path="sessions/*" element={<SessionRoutes />} />
          <Route path="month" element={<CalendarMonth />} />
          <Route path="clients/*" element={<ClientRoutes />} />
          <Route path="goals/*" element={<GoalRoutes />} />
          <Route path="groups/*" element={<GroupRoutes />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="users/*" element={<UserRoutes />} />
          <Route path="week" element={<CalendarWeek />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
