interface FetchDeezerProps {
  endpoint: string;
  params?: Record<string, string | number | boolean>;
}

export const fetchDeezerJSONP = <T = any>({
  endpoint,
  params = {},
}: FetchDeezerProps): Promise<T> => {
  return new Promise((resolve, reject) => {
    const callbackName = `deezer_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const urlParams = new URLSearchParams({
      ...(params as Record<string, string>),
      output: 'jsonp',
      callback: callbackName,
    });

    const script = document.createElement('script');
    script.src = `https://api.deezer.com/${endpoint.replace(/^\//, '')}?${urlParams.toString()}`;

    const cleanup = () => {
      delete (window as any)[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      if (data && data.error) {
        reject(data.error);
      } else {
        resolve(data as T);
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error(`Error de red al consultar Deezer vía JSONP (${endpoint})`));
    };

    document.head.appendChild(script);
  });
};

