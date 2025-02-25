import { URL } from 'react-native-url-polyfill';
import { NetworkType, type HttpRequest, type WebSocketRequest } from '../types';

export const getNetworkUtils = (data: HttpRequest | WebSocketRequest) => {
  const isHttp = data?.type !== NetworkType.WS;
  const requestUrl = new URL(data.url);

  const overviewShown = !!data.url;
  const headersShown = isHttp && (!!data.requestHeaders || !!data.responseHeaders);
  const requestShown = isHttp && (!!requestUrl.search || !!data.body);
  const responseShown = isHttp && !!data.response;
  const messagesShown = !isHttp && !!data.messages;

  return {
    isHttp,
    requestUrl,
    overviewShown,
    headersShown,
    requestShown,
    responseShown,
    messagesShown,
  };
};

//#region metrics
export const getVerticalSafeMargin = (screenHeight: number) => screenHeight / 8;

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const getHttpInterceptorId = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substring(2, 10);
  return timestamp + randomNum;
};
//#endregion

//#region formatters
export const limitChar = (value: any, limit = 5000) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value ?? '');

  return stringValue.length > limit
    ? `${stringValue.slice(0, limit)}\n---LIMITED TO ${limit} CHARACTERS---`
    : stringValue;
};

export const keyValueToString = (
  key: string,
  value: any,
  newLine: 'leading' | 'trailing' | null = 'trailing',
): string =>
  `${newLine === 'leading' ? '\n' : ''}${key}: ${limitChar(value)}${newLine === 'trailing' ? '\n' : ''}`;

export const formatRequestMethod = (method?: string) => method ?? 'GET';

export const formatRequestDuration = (duration?: number) =>
  duration ? `${duration}ms` : 'pending';

export const formatRequestStatusCode = (statusCode?: number) => `${statusCode ?? 'pending'}`;

export const formatLogMessage = (type: string, values: any[]) => {
  const message: string = values.reduce(
    (pre, cur, index) => pre + (!index ? '' : ', ') + limitChar(cur),
    '',
  );

  return `${type.toUpperCase()}: ${message}`;
};

export const beautify = (data: any, beautified: boolean) => {
  try {
    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return beautified ? JSON.stringify(res, null, 2) : limitChar(res);
  } catch (error) {
    return limitChar(data);
  }
};

export const convertToCurl = (
  method: HttpRequest['method'],
  url: HttpRequest['url'],
  headers: HttpRequest['requestHeaders'],
  body: HttpRequest['body'],
) => {
  let curlCommand = `curl -X ${method.toUpperCase()} "${url}"`;

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      curlCommand += ` -H "${key}: ${value}"`;
    }
  }

  if (body) {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    curlCommand += ` -d '${bodyString}'`;
  }

  return curlCommand;
};
//#endregion

//#region decorators
export function frozen(_target: Object) {
  const descriptor: PropertyDescriptor = arguments[2];
  descriptor.configurable = false;
  descriptor.writable = false;
}

export function singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  class Singleton extends constructor {
    static #instance: Singleton;

    constructor(...args: any[]) {
      if (Singleton.#instance) return Singleton.#instance;

      super(...args);
      Singleton.#instance = this;
    }
  }

  return Singleton;
}
//#endregion
