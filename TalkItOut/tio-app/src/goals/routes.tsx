import {Route, Routes} from 'react-router-dom';
import Goals from './goal-listing';

export const GoalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Goals />}></Route>
    </Routes>
  );
};
