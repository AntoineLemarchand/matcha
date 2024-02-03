import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import Profile from "./pages/Profile";
import Profiles from "./pages/Profiles";
import ProfileEdit from "./pages/ProfileEdit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Likes from "./pages/Likes";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Profiles />} />
          <Route path="likes" element={<Likes />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="edit" element={<ProfileEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
