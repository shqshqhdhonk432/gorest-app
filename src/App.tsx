import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';

import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Posts } from './pages/Posts';
import { UserCard } from './pages/UserCard';
import { PostCard } from './pages/PostCard';

function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/users/:id" element={<UserCard />} />
            <Route path="/posts/:id" element={<PostCard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Theme>
  );
}

export default App;
