export function handleApiError(
  err: unknown,
  fallbackMessage = 'Eroare la procesarea solicitarii.'
): string {
  const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.response?.data?.error ||
    fallbackMessage
  );
}

// Backward compatibility for existing imports
export { handleApiError as getApiErrorMessage };
