import { useState } from 'react';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('pipelines');

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <>
      {currentPage === 'pipelines' && (
        <HomePage user={user} onLogout={() => setUser(null)} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'tickets' && (
        <TicketsPage user={user} onLogout={() => setUser(null)} onNavigate={setCurrentPage} />
      )}
    </>
  );
}
