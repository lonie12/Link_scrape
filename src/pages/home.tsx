import { useEffect, useState } from "react";
import { ExportSquare, Logout } from "iconsax-react";
import { User } from "../models/propspect";
import { UserDetailRow } from "../components/user-details";
import ExtIconsax from "../helpers/icons";
import axios from "axios";
// import { downloadJsonFile } from "../helpers/utils";

export default function HomePage() {
  const [profileData, setProfileData] = useState<User | undefined>(undefined);
  const [userData, setUserData] = useState<Session | undefined>(undefined);
  const [message, setMessage] = useState<
    { title: string; message: string; error?: boolean } | undefined
  >();

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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const checkUserLogin = async () => {
    const result = await chrome.storage.sync.get("auth");
    setUserData(result.auth.userData);
  };

  const handleMessage = (message: [User, string]) => {
    if (message) {
      const data = { ...message[0], p_email: message[1] };
      console.log(data, "Scraped data");
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
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData?.accessToken}`;
      const result = await axios.post("http://localhost:5000/api/prospect", {
        ...profileData,
      });
      if (result && result.status == 201) {
        return setMessage({
          title: "Success",
          message: "Data uploaded successfuly",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        title: "Error",
        message: "Please try again !!!",
        error: true,
      });
    }
  };

  const handleLogout = async () => {
    chrome.storage.sync.set({
      auth: { loggedIn: false, userData: undefined },
    });
  };

  return (
    <div className="relative">
      <button
        style={{ backgroundColor: "#dc2626", padding: 4, borderRadius: "50%" }}
        className="absolute right-2"
        onClick={handleLogout}
      >
        <Logout />
      </button>
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <img className="size-9" src="../assets/logo.png" alt="" />
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold">Profile Scraping</h2>
            {userData?.name}
          </div>
        </div>
        <p className="text-[15px] text-gray-600 mt-2">
          Use to scrape user data from their LinkedIn profile
        </p>
        <a
          className="flex gap-2 items-center text-[#1d4ed8]"
          target="_blank"
          href="http://localhost:3000"
        >
          <span className="text-[15px] text-base">Open Dashboard</span>
          <ExportSquare size={16} />
        </a>

        {message && (
          <div
            className={`flex items-center gap-2 my-2 border rounded-md p-3 ${
              message?.error
                ? "bg-[#fee2e2] text-[#dc2626] border-[#dc2626]"
                : "bg-[#dcfce7] text-[#16a34a] border-[#16a34a]"
            }`}
          >
            <h3 className="font-bold">{message?.title}:</h3>{" "}
            <span>{message?.message}</span>
          </div>
        )}
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
