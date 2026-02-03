import { AuthProvider, useAuth } from '@context/AuthContext';
import { R2Provider } from '@context/R2Context';
import { UIProvider } from '@context/UIContext';
import { CredentialsModal } from '@components/auth/CredentialsModal';
import { Header } from '@components/layout/Header';
import { FileBrowser } from '@components/browser/FileBrowser';
import { ToastContainer } from '@components/common/Toast';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-background">
      {!isAuthenticated ? (
        <CredentialsModal />
      ) : (
        <>
          <Header />
          <main className="flex-1 overflow-hidden">
            <FileBrowser />
          </main>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <R2Provider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </R2Provider>
    </AuthProvider>
  );
}

export default App
