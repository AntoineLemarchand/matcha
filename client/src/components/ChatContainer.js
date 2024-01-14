import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import { useState } from "react";

const ChatContainer = ({user}) => {
  const [ tab, setTab ] = useState(false)

  return (
    <div className="chat-container">
      <ChatHeader user={user} tab={tab} switchTab={setTab}/>
      {
        tab
          ? <MatchesDisplay />
          : <ChatDisplay />
      }

    </div>
  );
};

export default ChatContainer;
