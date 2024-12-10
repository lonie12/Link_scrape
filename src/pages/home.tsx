import { useEffect, useState } from "react";
import { ExportSquare, Login, Logout } from "iconsax-react";
import { User } from "../models/propspect";
import { UserDetailRow } from "../components/user-details";
import ExtIconsax from "../lib/icons";
import axios from "axios";
import { apiUrl, appUrl } from "../lib/env";
import { useNavigate } from "react-router-dom";
import { useToaster } from "../context/toastContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { showToaster } = useToaster();
  const [profileData, setProfileData] = useState<User | undefined>(undefined);
  const [userData, setUserData] = useState<Session | undefined>(undefined);

  useEffect(() => {
    if (chrome) {
      checkUserLogin();
      if (chrome.runtime) {
        chrome.runtime.onMessage.addListener(handleMessage);
        return () => {
          chrome.runtime.onMessage.removeListener(handleMessage);
        };
      }
    }
  }, []);

  const checkUserLogin = async () => {
    const result = await chrome.storage.sync.get("auth");
    setUserData(result.auth?.userData);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMessage = (message: any) => {
    if (message && Object.prototype.hasOwnProperty.call(message, "auth")) {
      setUserData(message.auth.userData);
    } else {
      const data = { ...message[0], p_email: message[1] };
      setProfileData(data);
    }
  };

  const handleScrape = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id!, { startScraping: true });
    });
  };

  const handleDownload = async () => {
    if (!userData) {
      return showToaster("Log in to send data to your dashboard.");
    } else {
      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData?.accessToken}`;
        const result = await axios.post(`${apiUrl}/prospect`, {
          ...profileData,
        });
        if (result && result.status == 201) {
          return showToaster("Data uploaded successfuly.", "success");
        }
      } catch (e) {
        console.error(e);
        return showToaster("Server error try again later !!!");
      }
    }
  };

  const handleLogout = async () => {
    chrome.storage.sync.set({
      auth: { loggedIn: false, userData: undefined },
    });
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      {userData ? (
        <div className="absolute right-2 flex items-center gap-2">
          {!userData && <span className="font-medium">Logout</span>}
          <button
            className={`bg-[#dc2626] p-1 rounded-full`}
            onClick={handleLogout}
          >
            {userData ? <Logout /> : <Login />}
          </button>
        </div>
      ) : (
        <div className="absolute right-2 flex items-center gap-2">
          {!userData && <span className="font-medium">Login</span>}
          <button
            className={`bg-blue-600 p-1 rounded-full`}
            onClick={() => navigate("/login")}
          >
            {userData ? <Logout /> : <Login />}
          </button>
        </div>
      )}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <img className="size-9" src="../assets/logo.png" alt="" />
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold">Profile Scraping</h2>
            {userData && `Logged as: ${userData?.name}`}
          </div>
        </div>
        <p className="text-[15px] text-gray-600 mt-2">
          Use to scrape user data from their LinkedIn profile
        </p>
        <a
          className="flex gap-2 items-center text-[#1d4ed8]"
          target="_blank"
          href={appUrl}
        >
          <span className="text-[15px] text-base">Open Dashboard</span>
          <ExportSquare size={16} />
        </a>
      </div>
      {profileData && (
        <div className="flex flex-col gap-3">
          <UserDetailRow
            ikey="Username"
            value={profileData.p_uname}
            Icon={ExtIconsax.User}
          />
          <UserDetailRow
            ikey="Email"
            value={profileData.p_email}
            Icon={ExtIconsax.Sms}
          />
          <UserDetailRow
            ikey="Title"
            value={profileData.p_title}
            Icon={ExtIconsax.Briefcase}
          />
          <UserDetailRow
            ikey="Followers"
            value={profileData.nbFollowers}
            Icon={ExtIconsax.Profile2User}
          />
          <UserDetailRow
            ikey="Following"
            value={profileData.nbFollowing}
            Icon={ExtIconsax.Chart1}
          />
        </div>
      )}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleScrape()}
          id="scrape"
          className="py-2 px-5 rounded-md mt-4 transition-colors"
        >
          Scrape data
        </button>
        {profileData && (
          <button
            title="Add new user"
            onClick={handleDownload}
            // onClick={() => downloadJsonFile(profileData)}
            id="scrape"
            className="flex items-center gap-1 bg-[#16a34a] py-2 px-5 rounded-md mt-4 transition-colors"
          >
            <ExtIconsax.DocumentDownload size={18} />
            Download
          </button>
        )}
      </div>
    </div>
  );
}
