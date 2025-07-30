export function getApiErrorMessage(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.response?.data?.error ||
    'Eroare la procesarea solicitarii.'
  );
}