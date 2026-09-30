const DEVICE_KEY = 'ce_device_id';

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Нэг browser = нэг төхөөрөмж. localStorage-д хадгалагдсан UUID-ийг backend
 * session-той холбож, ижил browser-ээс дахин нэвтрэхэд шинэ төхөөрөмж гэж тоолохгүй.
 */
export function getDeviceId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const existing = localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const id = randomId();
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}
