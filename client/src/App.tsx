import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoginPage } from "pages/LoginPage";
import { SignUpPage } from "pages/SignUpPage";
import { routes } from "constants/routes";
import { ManagementPage } from "pages/ManagementPage";
import { CurrentAccountProvider } from "hooks/useCurrentAccount/CurrentAccountContext";
import { UnauthenticatedRouter } from "config/router/UnauthenticatedRouter";
import { AuthenticatedRouter } from "config/router/AuthenticatedRouter";
import { ConfigProvider } from "antd";
import jaJp from "antd/lib/locale/ja_JP";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();
const App = () => (
  <ConfigProvider locale={jaJp}>
    <CurrentAccountProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route
                path={routes.signUp()}
                element={
                  <AuthenticatedRouter>
                    <SignUpPage />
                  </AuthenticatedRouter>
                }
              />
              <Route
                path={routes.login()}
                element={
                  <AuthenticatedRouter>
                    <LoginPage />
                  </AuthenticatedRouter>
                }
              />
              <Route
                path={routes.managements()}
                element={
                  <UnauthenticatedRouter>
                    <ManagementPage />
                  </UnauthenticatedRouter>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </CurrentAccountProvider>
  </ConfigProvider>
);

export default App;
