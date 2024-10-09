import {Route, Routes} from 'react-router-dom';
import Clients from './clients-listing';

export const ClientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Clients />}></Route>
    </Routes>
  );
};
