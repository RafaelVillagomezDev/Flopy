export interface SearchOptions extends Omit<RequestInit, 'signal'> {
  // Aquí puedes añadir campos propios si quieres, o dejarlo vacío
  signal?: AbortSignal;
}