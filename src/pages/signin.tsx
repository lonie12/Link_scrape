import { useState } from "react";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { Google } from "iconsax-react";
import axios, { isAxiosError } from "axios";
import { appUrl } from "../lib/env";
import { useNavigate } from "react-router-dom";
import SpinLoader from "../components/spin";
import { useToaster } from "../context/toastContext";

type InputChangeProp = React.ChangeEvent<HTMLInputElement>;

export default function SignInPage() {
  const navigate = useNavigate();
  const { showToaster } = useToaster();
  const [authenticating, setAuthenticating] = useState(false);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      setAuthenticating(true);
      if (!loginData.email || !loginData.password) return;

      const result = await axios.post(`${appUrl}/auth/login`, {
        ...loginData,
      });

      setAuthenticating(false);
      if (result.status == 200) {
        chrome.storage.sync.set({
          auth: { loggedIn: true, userData: result.data },
        });
        showToaster("Successfully logged in.", "success");
        navigate("/", { replace: true });
      }
    } catch (error) {
      setAuthenticating(false);
      if (isAxiosError(error) && error.status == 401) {
        return showToaster(error.response?.data.message);
      }
    }
  };

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
        <Button onClick={handleLogin}>
          {authenticating && <SpinLoader />}
          Login
        </Button>
        <Button style={{ backgroundColor: "#1E1E1E" }}>
          <Google size={18} />
          <span>Continue with Google</span>
        </Button>

        <a
          className="self-center"
          target="_blank"
          href={`${appUrl}/auth/signup`}
        >
          <span className="text-[15px] text-base">
            Don't have Account ? <span className="text-[#1d4ed8]">Sing Up</span>
          </span>
        </a>
      </div>
    </div>
  );
}
