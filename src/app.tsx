import { useEffect, useState } from "react";
import { User } from "./models/user";
import { UserDetailRow } from "./components/user-details";
import ExtIconsax from "./helpers/icons";
import { downloadJsonFile } from "./helpers/utils";
import { ExportSquare } from "iconsax-react";

const App = () => {
  const [userData, setUserData] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (chrome.runtime) {
      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, []);

  const handleMessage = (message: [User, string]) => {
    if (message) {
      const data = { ...message[0], email: message[1] };
      setUserData(data);
    }
  };

  const handleScrape = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id!, { startScraping: true });
    });
  };

  return (
    <div className="p-4 min-w-[420px] max-w-[480px] border">
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <img className="size-9" src="../assets/logo.png" alt="" />
          <h2 className="text-xl font-bold">Profile Scraping</h2>
        </div>
        <p className="text-[15px] text-gray-600 mt-2">
          Use to scrape user data from their LinkedIn profile
        </p>
        <a
          className="flex gap-2 items-center text-[#1d4ed8]"
          target="_blank"
          href="https://google.com"
        >
          <span className="text-[15px] text-base">Open Dashboard</span>
          <ExportSquare size={16} />
        </a>
      </div>
      {userData && (
        <div className="flex flex-col gap-3">
          <UserDetailRow
            ikey="Username"
            value={userData.userName}
            Icon={ExtIconsax.User}
          />
          <UserDetailRow
            ikey="Email"
            value={userData.email}
            Icon={ExtIconsax.Sms}
          />
          <UserDetailRow
            ikey="Title"
            value={userData.userTitle}
            Icon={ExtIconsax.Briefcase}
          />
          <UserDetailRow
            ikey="Followers"
            value={userData.nbFollowers}
            Icon={ExtIconsax.Profile2User}
          />
          <UserDetailRow
            ikey="Following"
            value={userData.nbFollowing}
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
        {userData && (
          <button
            title="Add new user"
            onClick={() => downloadJsonFile(userData)}
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
};

export default App;
