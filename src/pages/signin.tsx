import { useEffect, useState } from "react";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { Google } from "iconsax-react";
import axios, { isAxiosError } from "axios";

type InputChangeProp = React.ChangeEvent<HTMLInputElement>;

export default function SignInPage() {
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async () => {
    try {
      if (!loginData.email || !loginData.password) return;

      const result = await axios.post("http://localhost:5000/api/auth/login", {
        ...loginData,
      });
      if (result.status == 200) {
        chrome.storage.sync.set({
          auth: { loggedIn: true, userData: result.data },
        });
      }
    } catch (error) {
      if (isAxiosError(error) && error.status == 401) {
        return setError(error.response?.data.message);
      }
    }
  };

  // chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  //   const tab = tabs[0];

  //   chrome.tabs.sendMessage(tab.id!, { loggedIn: true });
  // });

  const handleInputChange = (e: InputChangeProp) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  return (
    <div>
      <div className="mb-3">
        <div className="flex items-center space-x-3">
          <img className="size-9" src="../assets/logo.png" alt="" />
          <h2 className="text-xl font-bold">Profile Scraping</h2>
        </div>
        <p className="text-[15px] text-gray-600 mt-2">
          Use to scrape user data from their LinkedIn profile
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-2 border rounded-md p-3 bg-[#fee2e2] text-[#dc2626] border-[#dc2626]">
          <h3 className="font-bold">Error:</h3> <span>{error}</span>
        </div>
      )}

      <h2 className="text-xl font-bold mb-2">Sign In</h2>
      <div className="flex gap-4 flex-col">
        <TextInput
          required
          id="email"
          type="email"
          value={loginData.email}
          placeholder="Email"
          onChange={handleInputChange}
        />
        <TextInput
          required
          id="password"
          type="password"
          value={loginData.password}
          placeholder="********"
          onChange={handleInputChange}
        />
        <Button onClick={handleLogin}>Login</Button>
        <Button style={{ backgroundColor: "rgb(64 64 64)" }}>
          <Google size={18} />
          <span>Continue with Google</span>
        </Button>

        <a
          className="self-center"
          target="_blank"
          href="http://localhost:3000/auth/signup"
        >
          <span className="text-[15px] text-base">
            Don't have Account ? <span className="text-[#1d4ed8]">Sing Up</span>
          </span>
        </a>
      </div>
    </div>
  );
}
