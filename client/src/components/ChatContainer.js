import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import { useState } from "react";
import OnBoarding from "../pages/OnBoarding";

const ChatContainer = ({user}) => {
  const [ tab, setTab ] = useState(false)

  return (
    <div className="chat-container">
      <ChatHeader user={user} tab={tab} switchTab={setTab}/>
      {
        tab
          ? <MatchesDisplay />
          : <OnBoarding header='0'/>
      }

    </div>
  );
};

export default ChatContainer;
