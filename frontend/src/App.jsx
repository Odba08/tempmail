import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import EmailHeader from './components/EmailHeader';
import EmailList from './components/EmailList';
import EmailViewer from './components/EmailViewer';
import { useEmailPolling } from './hooks/useEmailPolling';
import { deleteEmail } from './services/emailService';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#a855f7' },
    background: { default: '#0b0f19', paper: '#1e293b' },
    text: { primary: '#f8fafc', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export default function App() {
  const [username, setUsername] = useState('pedidos01');
  const [domain, setDomain] = useState('@tu-pedido-mv.lat');
  const activeEmail = `${username}${domain}`;

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const {
    emails,
    loading,
    isRefreshing,
    error,
    refreshManually,
    setEmails,
  } = useEmailPolling(activeEmail);

  // Generar correo aleatorio
  const handleRandomize = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomName = 'user_';
    for (let i = 0; i < 6; i++) {
      randomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUsername(randomName);
    setSelectedEmail(null);
  };

  // Eliminar correo
  const handleDeleteEmail = async (id) => {
    try {
      await deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e.id !== id));
      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
      }
      setToastMessage('Correo eliminado con éxito');
    } catch {
      setToastMessage('Error al eliminar el correo');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 1.5, md: 3 } }}>
        <Container maxWidth="xl">
          {/* Header con generador y selector */}
          <EmailHeader
            username={username}
            setUsername={(val) => {
              setUsername(val);
              setSelectedEmail(null);
            }}
            domain={domain}
            setDomain={setDomain}
            activeEmail={activeEmail}
            onRandomize={handleRandomize}
            emailsCount={emails.length}
            isRefreshing={isRefreshing}
            onRefresh={refreshManually}
          />

          {error && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
              {error} (Asegúrate de que el backend en NestJS esté encendido en http://localhost:3000)
            </Alert>
          )}

          {/* Bandeja de Entrada + Visualizador */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} lg={4.5}>
              <EmailList
                emails={emails}
                selectedEmail={selectedEmail}
                onSelectEmail={setSelectedEmail}
                onDeleteEmail={handleDeleteEmail}
                loading={loading}
              />
            </Grid>

            <Grid item xs={12} md={7} lg={7.5}>
              <EmailViewer email={selectedEmail} />
            </Grid>
          </Grid>
        </Container>

        {/* Toast Notificaciones */}
        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={3000}
          onClose={() => setToastMessage('')}
          message={toastMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </ThemeProvider>
  );
}
