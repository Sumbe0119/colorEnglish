export type EnrollmentConfig = {
  intakeMonth: string;
  startDate: string;
  endDate: string;
};

export const ENROLLMENT_STORAGE_KEY = "color-english-enrollment-config";

export const DEFAULT_ENROLLMENT_CONFIG: EnrollmentConfig = {
  intakeMonth: "2026-03",
  startDate: "2026-03-01",
  endDate: "2026-03-30",
};

let lastClientRawSnapshot: string | null = null;
let lastClientParsedSnapshot: EnrollmentConfig = DEFAULT_ENROLLMENT_CONFIG;

function parseConfig(raw: string | null): EnrollmentConfig {
  if (!raw) {
    return DEFAULT_ENROLLMENT_CONFIG;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<EnrollmentConfig>;
    if (parsed.intakeMonth && parsed.startDate && parsed.endDate) {
      return {
        intakeMonth: parsed.intakeMonth,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
      };
    }
  } catch {
    return DEFAULT_ENROLLMENT_CONFIG;
  }

  return DEFAULT_ENROLLMENT_CONFIG;
}

function toUtcMs(dateValue: string): number {
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) {
    return Number.NaN;
  }
  return Date.UTC(year, month - 1, day);
}

export function calculateEnrollmentProgress(
  startDate: string,
  endDate: string,
  now: Date = new Date()
): number {
  const startMs = toUtcMs(startDate);
  const endMs = toUtcMs(endDate);
  const nowMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return 0;
  }

  if (endMs <= startMs) {
    return 0;
  }

  const elapsed = nowMs - startMs;
  const duration = endMs - startMs;
  const raw = (elapsed / duration) * 100;

  return Math.min(100, Math.max(0, Math.round(raw)));
}

export function formatIntakeMonth(monthValue: string): string {
  if (!monthValue) {
    return "Тохируулаагүй";
  }

  const [year, month] = monthValue.split("-");
  if (!year || !month) {
    return "Тохируулаагүй";
  }

  return `${year} оны ${Number(month)} сар`;
}

export function formatDisplayDate(dateValue: string): string {
  if (!dateValue) {
    return "--/--/----";
  }

  const [year, month, day] = dateValue.split("-");
  if (!year || !month || !day) {
    return "--/--/----";
  }

  return `${year}.${month}.${day}`;
}

export function getEnrollmentConfigSnapshot(): EnrollmentConfig {
  if (typeof window === "undefined") {
    return DEFAULT_ENROLLMENT_CONFIG;
  }

  const raw = window.localStorage.getItem(ENROLLMENT_STORAGE_KEY);

  if (raw === lastClientRawSnapshot) {
    return lastClientParsedSnapshot;
  }

  const parsed = parseConfig(raw);
  lastClientRawSnapshot = raw;
  lastClientParsedSnapshot = parsed;
  return parsed;
}

export function getEnrollmentConfigServerSnapshot(): EnrollmentConfig {
  return DEFAULT_ENROLLMENT_CONFIG;
}

export function subscribeEnrollmentConfig(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("enrollment-config-updated", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("enrollment-config-updated", handler);
  };
}

export function saveEnrollmentConfig(config: EnrollmentConfig): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event("enrollment-config-updated"));
}
