import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import { useState } from "react";

const ChatContainer = ({user}) => {
  const [ tab, setTab ] = useState(false)

  const switchTab = (value) => setTab(value);

  return (
    <div className="chat-container">
      <ChatHeader user={user} switchTab={switchTab}/>
      {tab}
      {
        tab
          ? <MatchesDisplay />
          : <ChatDisplay />}

    </div>
  );
};

export default ChatContainer;
