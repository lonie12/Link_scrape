import React, { Suspense } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./index.css";
import Toaster from "./components/toaster";

const HomePage = React.lazy(() => import("./pages/home"));
const SignInPage = React.lazy(() => import("./pages/signin"));

const App = () => {
  return (
    <div className="p-4 min-w-[420px] max-w-[480px] border">
      <Suspense fallback={<></>}>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
};

export default App;
