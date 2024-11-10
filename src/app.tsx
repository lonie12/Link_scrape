import React, { Suspense, useEffect, useState } from "react";
import "./index.css";
import { User } from "./models/propspect";

const HomePage = React.lazy(() => import("./pages/home"));
const SignInPage = React.lazy(() => import("./pages/signin"));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<{
    loggedIn: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userData?: any;
  }>({ loggedIn: false, userData: undefined });

  useEffect(() => {
    if (chrome) {
      checkUserLogin();

      if (chrome.runtime && isLoggedIn) {
        chrome.runtime.onMessage.addListener(handleMessage);
        return () => {
          chrome.runtime.onMessage.removeListener(handleMessage);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserLogin = async () => {
    const result = await chrome.storage.sync.get("auth");
    const { loggedIn, userData } = result.auth;
    setIsLoggedIn({ userData, loggedIn: Boolean(loggedIn) });
  };

  const handleMessage = (message: {
    auth: { loggedIn: boolean | string; userData: User | undefined };
  }) => {
    console.log(message);
    if (message && Object.prototype.hasOwnProperty.call(message, "auth")) {
      setIsLoggedIn({
        userData: message.auth.userData,
        loggedIn: Boolean(message.auth.loggedIn),
      });
    }
  };

  return (
    <div className="p-4 min-w-[420px] max-w-[480px] border">
      <Suspense fallback={<></>}>
        {isLoggedIn.loggedIn ? <HomePage /> : <SignInPage />}
      </Suspense>
    </div>
  );
};

export default App;
