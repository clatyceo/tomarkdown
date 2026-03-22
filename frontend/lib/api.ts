const API_BASE = "/api/convert";

export interface ConvertResult {
  markdown: string;
  metadata: { title: string; type: string; size: number };
}

async function handleResponse(res: Response): Promise<ConvertResult> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Conversion failed" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

export async function convertFile(file: File, type: string): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const res = await fetch(API_BASE, { method: "POST", body: formData });
  return handleResponse(res);
}

export async function convertUrl(url: string, type: string): Promise<ConvertResult> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, type }),
  });
  return handleResponse(res);
}
