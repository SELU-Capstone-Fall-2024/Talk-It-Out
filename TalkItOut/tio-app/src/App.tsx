import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/not-found";
import { UserRoutes } from "./users/routes";
import { SessionRoutes } from "./sessions/routes";
import { GoalRoutes } from "./goals/routes";
import { GroupRoutes } from "./groups/routes";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";
import { ClientRoutes } from "./clients/routes";
import Navbar from "./components/nav-bar";

function App() {
  return (
    <TamaguiProvider config={config}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/*">
            <Route index element={<UserRoutes />} />
            <Route path="sessions/*" element={<SessionRoutes />} />
            <Route path="clients/*" element={<ClientRoutes />} />
            <Route path="goals/*" element={<GoalRoutes />} />
            <Route path="groups/*" element={<GroupRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TamaguiProvider>
  );
}

export default App;
