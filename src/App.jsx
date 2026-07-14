import { useState } from 'react';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return <HomePage user={user} onLogout={() => setUser(null)} />;
}
