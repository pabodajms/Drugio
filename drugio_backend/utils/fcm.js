import axios from "axios";

export const sendFCMNotification = async (token, title, body) => {
  const serverKey = process.env.FCM_SERVER_KEY;

  const message = {
    to: token,
    notification: {
      title,
      body,
    },
  };

  await axios.post("https://fcm.googleapis.com/fcm/send", message, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${serverKey}`,
    },
  });
};
