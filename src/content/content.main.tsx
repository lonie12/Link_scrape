import * as React from "react";
import * as ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("floatingLogo")!).render(
  <React.StrictMode>
    <div
      onClick={() => alert("Clicked")}
      className="absolute right-6 top-8 z-[1000] w-12 h-12 rounded-full bg-red"
    >
      {/* <img
        src={chrome.runtime.getURL("assets/logo.png")}
        alt="Image"
        className="w-full h-full rounded-full object-cover cursor-pointer"
      /> */}
    </div>
  </React.StrictMode>
);
