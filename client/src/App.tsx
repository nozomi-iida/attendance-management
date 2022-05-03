import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { routes } from "./constants/routes";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route path={routes.signUp()} element={<LoginPage />} />
        <Route path={routes.login()} element={<SignUpPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
