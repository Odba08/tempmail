import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Tooltip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SyncIcon from '@mui/icons-material/Sync';
import EmailIcon from '@mui/icons-material/Email';

export default function EmailHeader({
  username,
  setUsername,
  domain,
  setDomain,
  activeEmail,
  onRandomize,
  emailsCount,
  isRefreshing,
  onRefresh,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)',
            }}
          >
            <EmailIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
              TempMail Catch-All
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tu buzón de correo desechable privado en tiempo real
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={`${emailsCount} mensaje${emailsCount === 1 ? '' : 's'}`}
            color="primary"
            variant="filled"
            size="small"
            sx={{ fontWeight: '600', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
          />
          <Tooltip title="Actualizar manualmente">
            <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              size="small"
              sx={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              <SyncIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Selector de correo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          p: 1.5,
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <TextField
          size="small"
          placeholder="nombre-de-usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase())}
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 180px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              fontFamily: 'monospace',
              fontSize: '1rem',
              fontWeight: '600',
            },
          }}
        />

        {/* Selector de Dominios Comprados */}
        <TextField
          select
          size="small"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          SelectProps={{ native: true }}
          sx={{
            flex: { xs: '1 1 100%', sm: '0 0 200px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderColor: '#a855f7',
              fontWeight: '700',
              color: '#d8b4fe',
            },
          }}
        >
          <option value="@tu-pedido-mv.lat" style={{ background: '#1e293b', color: '#fff' }}>@tu-pedido-mv.lat</option>
          <option value="@mv-shipped.lat" style={{ background: '#1e293b', color: '#fff' }}>@mv-shipped.lat</option>
        </TextField>

        <Tooltip title={copied ? '¡Copiado al portapapeles!' : 'Copiar correo completo'}>
          <Button
            variant="contained"
            onClick={handleCopy}
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: '700',
              textTransform: 'none',
              background: copied
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: copied
                ? '0 6px 15px -3px rgba(16, 185, 129, 0.4)'
                : '0 6px 15px -3px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </Tooltip>

        <Button
          variant="outlined"
          onClick={onRandomize}
          startIcon={<AutorenewIcon />}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1,
            fontWeight: '600',
            textTransform: 'none',
            color: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            '&:hover': {
              borderColor: '#818cf8',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          }}
        >
          Aleatorio
        </Button>
      </Box>
    </Paper>
  );
}
