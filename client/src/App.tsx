import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { routes } from "./constants/routes";
import { ManagementPage } from "./pages/ManagementPage";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path={routes.signUp()} element={<SignUpPage />} />
          <Route path={routes.login()} element={<LoginPage />} />
          <Route path={routes.managements()} element={<ManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
