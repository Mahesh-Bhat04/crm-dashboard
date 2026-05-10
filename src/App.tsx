import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/react';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ContactsPage } from './pages/ContactsPage';
import { DealsPage } from './pages/DealsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { NotFoundPage } from './pages/NotFoundPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY. Check your .env.local file.');
}

function App() {
  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
            </Route>
            <Route element={<RootLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/deals" element={<DealsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </ClerkProvider>
    </ThemeProvider>
  );
}

export default App;
