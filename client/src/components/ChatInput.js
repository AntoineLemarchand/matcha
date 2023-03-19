import { useState } from "react";

const ChatInput = () => {
    const [textarea, setTextarea] = useState(null);
    return (
        <div className="chat-input">
            <textarea value={textarea} onChange={(e) => setTextarea(e.target.value)} />
            <button className="secondary-button">Send</button>
        </div>
    );
};

export default ChatInput;
