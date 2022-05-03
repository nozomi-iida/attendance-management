import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FC } from "react";
import { SignUpPage } from "./pages/SignUpPage";

const App: FC = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/sign_up" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
);

export default App;
