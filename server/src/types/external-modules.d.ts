declare module "ua-parser-js" {
  export interface UAParserDevice {
    vendor?: string;
    model?: string;
    type?: string;
  }

  export interface UAParserOS {
    name?: string;
    version?: string;
  }

  export interface UAParserBrowser {
    name?: string;
    version?: string;
  }

  export default class UAParser {
    constructor(userAgent?: string);
    getDevice(): UAParserDevice;
    getOS(): UAParserOS;
    getBrowser(): UAParserBrowser;
  }
}

declare module "geoip-lite" {
  export interface GeoIpLookup {
    city?: string | null;
    country?: string | null;
  }

  const geoip: {
    lookup(ip: string): GeoIpLookup | null;
  };

  export default geoip;
}