import { useState, useEffect } from 'react';
import { timer, from, of } from 'rxjs';
import { switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';
import { fetchInbox } from '../services/emailService';

/**
 * Hook de Polling con RxJS que consulta la bandeja de entrada cada 5 segundos
 */
export function useEmailPolling(emailAddress) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Función manual para refrescar
  const refreshManually = async () => {
    if (!emailAddress) return;
    setIsRefreshing(true);
    try {
      const data = await fetchInbox(emailAddress);
      setEmails(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Error al refrescar la bandeja');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!emailAddress || !emailAddress.includes('@')) {
      setEmails([]);
      return;
    }

    setLoading(true);
    setError(null);

    // timer(0, 5000): Inicia inmediatamente y repite cada 5000ms
    const subscription = timer(0, 5000)
      .pipe(
        // switchMap cancela automáticamente la petición anterior si el emailAddress cambió
        switchMap(() =>
          from(fetchInbox(emailAddress)).pipe(
            catchError((err) => {
              console.warn('[TempMail Polling] Error conectando al servidor:', err?.message);
              setError('No se pudo conectar con el servidor.');
              return of(null);
            })
          )
        )
      )
      .subscribe((data) => {
        if (data !== null) {
          setEmails(data);
          setError(null);
        }
        setLoading(false);
        setLastUpdated(new Date());
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [emailAddress]);

  return {
    emails,
    loading,
    isRefreshing,
    lastUpdated,
    error,
    refreshManually,
    setEmails,
  };
}
