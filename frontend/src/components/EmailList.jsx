import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function EmailList({
  emails,
  selectedEmail,
  onSelectEmail,
  onDeleteEmail,
  loading,
}) {
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.05rem' }}>
          Bandeja de Entrada
        </Typography>
        {loading && <CircularProgress size={18} sx={{ color: '#818cf8' }} />}
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {emails.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 4,
              textAlign: 'center',
              opacity: 0.5,
            }}
          >
            <MarkEmailReadIcon sx={{ fontSize: 56, mb: 1.5, color: '#94a3b8' }} />
            <Typography variant="body1" fontWeight="600" color="#f8fafc">
              Esperando correos entrantes...
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Todo mensaje enviado a tu dirección aparecerá aquí automáticamente.
            </Typography>
          </Box>
        ) : (
          emails.map((email, idx) => {
            const isSelected = selectedEmail?.id === email.id;
            return (
              <React.Fragment key={email.id}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onSelectEmail(email)}
                  sx={{
                    p: 2,
                    transition: 'all 0.15s ease',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15) !important' : 'transparent',
                    borderLeft: isSelected ? '4px solid #6366f1' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{
                            fontWeight: isSelected ? '700' : '600',
                            color: isSelected ? '#a5b4fc' : '#f1f5f9',
                            maxWidth: '70%',
                          }}
                        >
                          {email.subject || '(Sin Asunto)'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 13, color: '#64748b' }} />
                          <Typography variant="caption" color="#94a3b8" fontWeight="500">
                            {formatTime(email.receivedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" noWrap color="#94a3b8" sx={{ maxWidth: '85%' }}>
                          De: <strong>{email.sender}</strong>
                        </Typography>
                        <Tooltip title="Eliminar correo">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEmail(email.id);
                            }}
                            sx={{
                              p: 0.5,
                              color: '#64748b',
                              '&:hover': { color: '#ef4444' },
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </ListItemButton>
                {idx < emails.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
              </React.Fragment>
            );
          })
        )}
      </List>
    </Paper>
  );
}
