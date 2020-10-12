import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton/date";
import Message from "../Message";
import axios from "axios";
import moment from "moment";

import "./MessageList.css";

const MY_USER_ID = "Neha";

const getTimeStamp = (date = "10/31/2015", time = "7:00 AM") => {
  try {
    const [month, day, year] = date.split("/");
    let [hour, hourRemaining] = time.split(":");
    if (hourRemaining) {
      const [minute, zone] = hourRemaining.split(" ");
      if (zone !== "AM") {
        hour = +hour + 12;
      }
      debugger;
      return new Date(+year, +month - 1, +day, +hour, +minute).getTime();
    }
  } catch (e) {
    console.error(e);
  }
  return new Date().getTime();
};
const getDateString = (date = new Date()) => {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  day = +day;
  month = +month + 1;
  return `${month}/${day}/${year}`;
};

export default function MessageList(props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  }, []);

  const updateDate = (date) => {
    getMessages(getDateString(date));
  };
  const getMessages = (date) => {
    axios
      .get(
        "http://localhost:3003/api/chats/" +
          encodeURIComponent(date || "7/11/2015")
      )
      .then(function(response) {
        if (
          response.status === 200 &&
          response.data &&
          response.data.messageArray
        ) {
          let apiMessages = (response.data.messageArray || []).map(
            (item, i) => {
              const reference = {
                id: i,
                author: item.sender || "apple",
                message: item.message || "",
                timestamp: getTimeStamp(item.date, item.time),
              };
              return reference;
            }
          );
          apiMessages = apiMessages.sort((a, b) => a.timestamp - b.timestamp);
          setMessages([...apiMessages]);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessages([]);
      });
  };

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages && tempMessages.length ? (
      tempMessages
    ) : (
      <Message
        key={i}
        isMine={false}
        startsSequence={true}
        endsSequence={true}
        showTimestamp={false}
        data={{
          id: i,
          author: MY_USER_ID || "apple",
          message: "Hmmm guess we didn't talk today" || "",
          timestamp: getTimeStamp(),
        }}
      />
    );
  };

  return (
    <div className="message-list">
      <Toolbar
        title="chat-server"
        rightItems={[
          <ToolbarButton
            key="info"
            icon="ion-ios-information-circle-outline"
            updateDate={updateDate}
          />,
          // <ToolbarButton key="video" icon="ion-ios-videocam" />,
          // <ToolbarButton key="phone" icon="ion-ios-call" />
        ]}
      />

      <div className="message-list-container">{renderMessages()}</div>

      {/* <Compose
        rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />,
        ]}
      /> */}
    </div>
  );
}
