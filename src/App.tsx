import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  collection,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./App.css";

const config = {
  dbCollection: "chat",
  firebaseConfig: {
    apiKey: "AIzaSyAQOL97wBiYESb03TrX-d3d5Kh6jPWy2kc",
    authDomain: "cl-test-ba434.firebaseapp.com",
    projectId: "cl-test-ba434",
    storageBucket: "cl-test-ba434.appspot.com",
    messagingSenderId: "357080076822",
    appId: "1:357080076822:web:670ebb6d6291600c621b37",
  },
};

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, config.dbCollection),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages: any[] = [];

      QuerySnapshot.forEach((doc) => {
        console.log(doc);

        messages.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messages);
    });
    return () => unsubscribe as any;
  }, []);

  const sendMessage = async (event: any) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    await addDoc(collection(db, config.dbCollection), {
      text: message,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  return (
    <div className="app">
      <form className="send-message" onSubmit={(event) => sendMessage(event)}>
        <input
          aria-label="chat-text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <pre key={message.id}>{message.text}</pre>
        ))}
      </div>
    </div>
  );
}

export default App;
