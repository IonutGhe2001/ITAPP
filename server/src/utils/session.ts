import UAParser from "ua-parser-js";
import geoip from "geoip-lite";

export interface ParsedUserAgent {
  deviceName?: string;
  deviceType?: string;
  osName?: string;
  browserName?: string;
}

export interface GeoLocation {
  locationCity?: string;
  locationCountry?: string;
}

const DEVICE_TYPE_LABELS: Record<string, string> = {
  console: "Console",
  mobile: "Mobile",
  tablet: "Tablet",
  smarttv: "Smart TV",
  wearable: "Wearable",
  embedded: "Embedded",
};

export const parseUserAgentInfo = (userAgent?: string): ParsedUserAgent => {
  if (!userAgent) {
    return { deviceName: "Browser", deviceType: "Web" };
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  const osName = os.name
    ? `${os.name}${os.version ? ` ${os.version}` : ""}`.trim()
    : undefined;
  const browserName = browser.name
    ? `${browser.name}${browser.version ? ` ${browser.version}` : ""}`.trim()
    : undefined;

  let deviceName = `${device.vendor ?? ""} ${device.model ?? ""}`.trim();
  if (!deviceName) {
    deviceName = osName ?? browserName ?? "Browser";
  }

  const typeKey = device.type?.toLowerCase();
  const deviceType = typeKey
    ? DEVICE_TYPE_LABELS[typeKey] ?? typeKey.replace(/^./, (c: string) => c.toUpperCase())
    : "Web";

  return {
    deviceName,
    deviceType,
    osName,
    browserName,
  };
};

export const getClientIp = (
  ipAddress?: string,
  forwardedFor?: string | string[]
): string | undefined => {
  const forwardedValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor;

  if (forwardedValue) {
    const candidate = forwardedValue.split(",")[0]?.trim();
    if (candidate) {
      return candidate;
    }
  }

  if (!ipAddress) {
    return undefined;
  }

  if (ipAddress.startsWith("::ffff:")) {
    return ipAddress.substring(7);
  }

  if (ipAddress === "::1") {
    return "127.0.0.1";
  }

  return ipAddress;
};

export const resolveGeoLocation = (ipAddress?: string): GeoLocation => {
  if (!ipAddress) {
    return {};
  }

  try {
    const location = geoip.lookup(ipAddress);
    if (!location) {
      return {};
    }

    const city = location.city?.trim();
    const country = location.country?.trim();

    return {
      locationCity: city || undefined,
      locationCountry: country || undefined,
    };
  } catch (_err) {
    return {};
  }
};

const UNIT_IN_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

export const computeExpiresAt = (
  expiresIn?: string | number | null
): Date | null => {
  if (!expiresIn) {
    return null;
  }

  const now = Date.now();

  if (typeof expiresIn === "number") {
    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
      return null;
    }
    return new Date(now + expiresIn * 1000);
  }

  const trimmed = expiresIn.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    const seconds = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(seconds) && seconds > 0) {
      return new Date(now + seconds * 1000);
    }
    return null;
  }

  const match = trimmed.match(/^(\d+)([smhdw])$/i);
  if (!match) {
    return null;
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const multiplier = UNIT_IN_MS[unit];
  if (!multiplier) {
    return null;
  }

  return new Date(now + value * multiplier);
};