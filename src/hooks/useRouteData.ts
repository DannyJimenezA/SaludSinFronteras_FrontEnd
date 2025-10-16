/**
 * Hook que integra useFetch con React Router
 * Automáticamente hace peticiones basadas en la ruta actual
 */
import { useLocation, useParams } from 'react-router-dom';
import { useFetch } from './useFetch';
import { useMemo } from 'react';

interface RouteDataConfig<T> {
  /**
   * Función que genera la URL del endpoint basada en la ruta actual
   * Recibe pathname, params y puede retornar la URL del endpoint
   */
  getEndpoint?: (pathname: string, params: Record<string, string>) => string;

  /**
   * URL base del endpoint (opcional, si no se usa getEndpoint)
   * Se puede usar con template strings para incluir parámetros
   * Ej: '/api/users/:id'
   */
  endpoint?: string;

  /** Método HTTP */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  /** Función para transformar los datos */
  transform?: (data: any) => T;

  /** Si false, deshabilita la petición automática */
  enabled?: boolean;

  /** Parámetros de query adicionales */
  params?: Record<string, any>;
}

/**
 * Hook que conecta automáticamente con el backend según la ruta de React Router
 *
 * @example
 * // En el componente About
 * const { data, loading, error } = useRouteData({
 *   endpoint: '/api/about'
 * });
 *
 * @example
 * // Con parámetros de ruta
 * const { data, loading } = useRouteData({
 *   endpoint: '/api/users/:id',
 *   transform: (data) => data.user
 * });
 *
 * @example
 * // Con lógica personalizada
 * const { data } = useRouteData({
 *   getEndpoint: (pathname, params) => {
 *     if (pathname.includes('about')) return '/api/about';
 *     if (pathname.includes('contact')) return '/api/contact';
 *     return '/api' + pathname;
 *   }
 * });
 */
export function useRouteData<T = any>(config: RouteDataConfig<T>) {
  const location = useLocation();
  const params = useParams();

  // Generar URL del endpoint
  const url = useMemo(() => {
    if (config.getEndpoint) {
      return config.getEndpoint(location.pathname, params);
    }

    if (config.endpoint) {
      // Reemplazar parámetros de ruta en el endpoint
      let endpoint = config.endpoint;
      Object.entries(params).forEach(([key, value]) => {
        endpoint = endpoint.replace(`:${key}`, value || '');
      });
      return endpoint;
    }

    // Fallback: usar el pathname como endpoint
    return '/api' + location.pathname;
  }, [location.pathname, params, config.getEndpoint, config.endpoint]);

  // Usar useFetch con la URL generada
  return useFetch<T>({
    url,
    method: config.method || 'GET',
    transform: config.transform,
    enabled: config.enabled,
    params: config.params,
    dependencies: [location.pathname, params],
  });
}
