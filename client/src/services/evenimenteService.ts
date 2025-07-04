const API_URL = "/api/evenimente";

export async function fetchEvenimente(token: string) {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Nu s-au putut încărca evenimentele.");
  }
  return res.json();
}

export async function createEveniment(token: string, eveniment: { titlu: string; data: string; ora: string }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eveniment),
  });

  if (!res.ok) {
    throw new Error("Nu s-a putut crea evenimentul.");
  }
  return res.json();
}

export async function deleteEveniment(token: string, id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Nu s-a putut șterge evenimentul.");
}

export async function updateEveniment(
  token: string,
  id: number,
  data: { titlu: string; ora: string; data?: string }
) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Nu s-a putut actualiza evenimentul.");
  return res.json();
}
