import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Chip,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';
import CodeIcon from '@mui/icons-material/Code';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

export default function EmailViewer({ email }) {
  const hasHtml = Boolean(email && email.htmlBody && email.htmlBody.trim());
  const hasText = Boolean(email && email.textBody && email.textBody.trim());

  // Si tiene HTML arrancamos en tab 0, si solo texto en tab 1
  const [tab, setTab] = useState(0);

  React.useEffect(() => {
    if (email) {
      if (hasHtml) {
        setTab(0);
      } else if (hasText) {
        setTab(1);
      }
    }
  }, [email?.id, hasHtml, hasText]);

  if (!email) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '640px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <DraftsIcon sx={{ fontSize: 64, mb: 2, color: '#475569' }} />
        <Typography variant="h6" fontWeight="600" color="#94a3b8">
          Selecciona un correo para leerlo
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ maxWidth: 320, mt: 0.5 }}>
          Haz clic en cualquier mensaje de la bandeja de entrada para ver su contenido completo.
        </Typography>
      </Paper>
    );
  }

  // Extracción inteligente de OTP (en texto, asunto o HTML)
  const cleanHtmlText = (email.htmlBody || '').replace(/<[^>]*>/g, ' ');
  const fullContent = `${email.subject || ''} ${email.textBody || ''} ${cleanHtmlText}`;
  const otpMatch =
    fullContent.match(/(?:código|code|pin|verificación|verification|security code)[\s:]*([0-9]{4,8})/i) ||
    fullContent.match(/\b([0-9]{5,6})\b/);
  const otpCode = otpMatch ? otpMatch[1] : null;

  return (
    <Paper
      elevation={0}
      sx={{
        height: '640px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}
    >
      {/* Header del Correo */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.3px', mb: 2 }}>
          {email.subject || '(Sin Asunto)'}
        </Typography>

        {/* DETECTOR INTELIGENTE DE CÓDIGO OTP (SHEIN / FUTBIN / ETC) */}
        {otpCode && (
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⚡ Código de Verificación Detectado
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff', letterSpacing: '4px', fontFamily: 'monospace' }}>
                {otpCode}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigator.clipboard.writeText(otpCode)}
              sx={{
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.5)',
              }}
            >
              Copiar Código
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonOutlineIcon sx={{ fontSize: 18, color: '#818cf8' }} />
            <Typography variant="body2" color="#94a3b8">
              De: <strong style={{ color: '#f1f5f9' }}>{email.sender}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlternateEmailIcon sx={{ fontSize: 18, color: '#a855f7' }} />
            <Typography variant="body2" color="#94a3b8">
              Para: <strong style={{ color: '#f1f5f9' }}>{email.recipient}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography variant="caption" color="#64748b">
              {new Date(email.receivedAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Selector de Vista (HTML vs Texto) */}
      <Box
        sx={{
          px: 3,
          py: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, newTab) => setTab(newTab)}
          sx={{
            minHeight: '36px',
            '& .MuiTab-root': {
              minHeight: '36px',
              py: 0,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
            },
          }}
        >
          <Tab icon={<CodeIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Vista HTML" disabled={!hasHtml} />
          <Tab icon={<TextSnippetIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Texto Plano" disabled={!hasText} />
        </Tabs>

        <Chip
          label={hasHtml ? 'HTML disponible' : 'Solo texto'}
          size="small"
          variant="outlined"
          color={hasHtml ? 'primary' : 'default'}
          sx={{ fontSize: '0.7rem', borderColor: 'rgba(255,255,255,0.1)' }}
        />
      </Box>

      {/* Contenido del Correo */}
      <Box
        sx={{
          flex: 1,
          p: tab === 0 && hasHtml ? 0 : 3,
          overflowY: 'auto',
          backgroundColor: tab === 0 && hasHtml ? '#ffffff' : 'transparent',
          color: tab === 0 && hasHtml ? '#1e293b' : '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {tab === 0 && hasHtml ? (
          <iframe
            srcDoc={email.htmlBody}
            title={email.subject || 'Contenido del correo'}
            sandbox="allow-popups allow-popups-to-escape-sandbox"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '380px',
              border: 'none',
              backgroundColor: '#ffffff',
            }}
          />
        ) : (
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#e2e8f0',
              lineHeight: 1.6,
            }}
          >
            {email.textBody || email.htmlBody || '(Mensaje sin contenido)'}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
