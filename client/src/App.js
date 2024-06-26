import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import Profile from "./pages/Profile";
import Profiles from "./pages/Profiles";
import ProfileEdit from "./pages/ProfileEdit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Likes from "./pages/Likes";
import Chat from "./pages/Chat";
import History from "./pages/History";
import Recovery from "./pages/Recovery";
import Verify from "./pages/Verify";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/verify/:code" element={<Verify />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/recovery/:code" element={<Recovery />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Profiles />} />
          <Route path="likes" element={<Likes />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
