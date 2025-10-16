/**
 * Hook personalizado para realizar peticiones HTTP dinámicas al backend
 * Maneja estados de carga, error y datos automáticamente
 */
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { AxiosError, AxiosRequestConfig } from 'axios';

interface UseFetchOptions<T> {
  /** URL del endpoint (ej: '/about', '/contact') */
  url?: string;
  /** Método HTTP (GET, POST, PUT, DELETE, PATCH) */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Datos a enviar en el body (para POST, PUT, PATCH) */
  body?: any;
  /** Parámetros de query string */
  params?: Record<string, any>;
  /** Headers adicionales */
  headers?: Record<string, string>;
  /** Si true, ejecuta la petición automáticamente al montar */
  autoFetch?: boolean;
  /** Función para transformar los datos antes de guardarlos en el estado */
  transform?: (data: any) => T;
  /** Dependencias adicionales para re-ejecutar la petición */
  dependencies?: any[];
  /** Si true, no ejecuta la petición si url es undefined/null */
  enabled?: boolean;
}

interface UseFetchResult<T> {
  /** Datos recibidos del backend */
  data: T | null;
  /** Si está cargando */
  loading: boolean;
  /** Error si ocurrió */
  error: Error | null;
  /** Mensaje de error legible */
  errorMessage: string | null;
  /** Ejecutar/Re-ejecutar la petición manualmente */
  refetch: () => Promise<void>;
  /** Resetear el estado */
  reset: () => void;
  /** Si la petición fue exitosa */
  isSuccess: boolean;
  /** Si hubo error */
  isError: boolean;
}

export function useFetch<T = any>(
  options: UseFetchOptions<T>
): UseFetchResult<T> {
  const {
    url,
    method = 'GET',
    body,
    params,
    headers,
    autoFetch = true,
    transform,
    dependencies = [],
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // No ejecutar si no hay URL o si está deshabilitado
    if (!url || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);
    setErrorMessage(null);

    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        params,
        headers,
      };

      // Solo agregar data si no es GET
      if (method !== 'GET' && body) {
        config.data = body;
      }

      const response = await api.request<any>(config);

      // Transformar datos si se proporciona función
      const finalData = transform ? transform(response.data) : response.data;

      setData(finalData);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const error = err as Error;

      setError(error);
      setLoading(false);

      // Extraer mensaje de error del backend
      const backendMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Error desconocido al conectar con el servidor';

      setErrorMessage(backendMessage);

      // Log en desarrollo
      if (import.meta.env.DEV) {
        console.error('[useFetch] Error:', {
          url,
          method,
          error: backendMessage,
          response: axiosError.response?.data,
        });
      }
    }
  }, [url, method, body, params, headers, transform, enabled, ...dependencies]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setErrorMessage(null);
  }, []);

  // Auto-fetch cuando cambian las dependencias
  useEffect(() => {
    if (autoFetch && enabled) {
      fetchData();
    }
  }, [fetchData, autoFetch, enabled]);

  return {
    data,
    loading,
    error,
    errorMessage,
    refetch: fetchData,
    reset,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
  };
}
