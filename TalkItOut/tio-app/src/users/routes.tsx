import {Route, Routes} from 'react-router-dom';
import Users from './user-listing';

export const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Users />}></Route>
    </Routes>
  );
};
