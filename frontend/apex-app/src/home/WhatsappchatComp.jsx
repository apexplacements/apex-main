import React, { useState } from "react";
import './WhatsappchatComp.css';

const WhatsappchatComp = () => {

  const [showChat, setShowChat] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        sender: "Bot",
        text: "Hello 👋 Welcome to APEX SKILLS & PLACEMENT CENTRE"
      }
    ]);

  /* Send Message */
  const sendMessage = () => {

    if (message.trim() === "")
      return;

    /* User Message */
    const userMessage = {

      sender: "User",

      text: message
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    /* Auto Reply Logic */
    let botReply = "";

    const lowerMessage =
      message.toLowerCase();

    if (
      lowerMessage.includes("java")
    ) {

      botReply =
        "We provide Java Full Stack training with placement support.";

    }

    else if (
      lowerMessage.includes("python")
    ) {

      botReply =
        "Python Full Stack and Data Science courses are available.";

    }

    else if (
      lowerMessage.includes("fees")
    ) {

      botReply =
        "Please call 6305101723 for fee details.";

    }

    else if (
      lowerMessage.includes("contact")
    ) {

      botReply =
        "You can contact us at 6305101723.";

    }

    else {

      botReply =
        "Thank you for contacting APEX SKILLS & PLACEMENT CENTRE.";
    }

    /* Bot Reply Delay */
    setTimeout(() => {

      const botMessage = {

        sender: "Bot",

        text: botReply
      };

      setMessages((prev) => [
        ...prev,
        botMessage
      ]);

    }, 1000);

    setMessage("");
  };

  return (

    <div className="whatsapp-container">

      {/* Chat Box */}
      {showChat && (

        <div className="chat-box">

          {/* Header */}
          <div className="chat-header">
            APEX Support
          </div>

          {/* Messages */}
          <div className="chat-body">

            {messages.map(
              (msg, index) => (

                <div
                  key={index}

                  className={
                    msg.sender === "User"
                    ? "user-message"
                    : "bot-message"
                  }
                >

                  {msg.text}

                </div>

              )
            )}

          </div>

          {/* Footer */}
          <div className="chat-footer">

            <input
              type="text"

              placeholder="Type message..."

              value={message}

              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
            />

            <button
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

        </div>

      )}

      {/* WhatsApp Icon */}
      <img
        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/whatsapp.png"

        alt="WhatsApp"

        onClick={() =>
          setShowChat(!showChat)
        }
      />

    </div>
  );
};

export default WhatsappchatComp;