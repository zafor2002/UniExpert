import {
  toast as hotToast,
  Toaster as HotToaster,
  ToasterProps,
} from 'react-hot-toast';

// Re-export the toast API directly
export const toast = hotToast;

// Pre-configured Toaster component
export function Toaster(props: Partial<ToasterProps>) {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: '',
        style: {
          background: 'var(--toast-bg, #fff)',
          color: 'var(--toast-fg, #0f172a)',
          borderRadius: '0.75rem',
          border: '1px solid var(--toast-border, #e2e8f0)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#3BAA4A', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#fff' },
        },
      }}
      containerStyle={{ top: 72 }}
      gutter={8}
      {...props}
    />
  );
}

export default toast;
