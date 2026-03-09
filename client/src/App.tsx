import { Toaster } from 'react-hot-toast';
import { ProductListPage } from './pages/ProductListPage';

function App() {
  return (
    <>
      <ProductListPage />

      <Toaster
        position="bottom-right"
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e2030',
            color: '#e2e8f0',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#a78bfa', secondary: '#1e2030' },
            style: {
              background: '#1e2030',
              color: '#e2e8f0',
              borderLeft: '3px solid #a78bfa',
            },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1e2030' },
            style: {
              background: '#1e2030',
              color: '#e2e8f0',
              borderLeft: '3px solid #f87171',
            },
          },
        }}
      />
    </>
  );
}

export default App;
