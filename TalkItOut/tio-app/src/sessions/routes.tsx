import {Route, Routes} from 'react-router-dom';
import Sessions from './session-listing';

export const SessionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Sessions />}></Route>
    </Routes>
  );
};
