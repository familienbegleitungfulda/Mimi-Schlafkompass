import ChatPage from "./chat/ChatPage";
import ConfirmedPage from "./pages/ConfirmedPage";

function isConfirmedPath(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.replace(/\/+$/, "") === "/bestaetigt";
}

export default function App() {
  return isConfirmedPath() ? <ConfirmedPage /> : <ChatPage />;
}
