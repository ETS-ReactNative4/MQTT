// @flow
import Utils from './Utils';
import User from './User';
import { Base64 } from 'js-base64';
import Url from './Url';

type HttpConfig = {
  headers?: any,
}

type Result = {
  ResultInfo: string,
  ResultCode: number,
  Data: any,
}

function _patchUrl(url: string, params?: any): string {
  let actualUrl = url;
  if (!/^(?:http[s]?:)?\/\//.test(url)) {
   // actualUrl = `${process.env.REACT_APP_URL || ''}/${url}`;
     actualUrl = Url.baseUrl+ `/${url}`;
  }
  if (typeof params !== 'undefined') {
    const box = [];
    for (const key in params) {
      // noinspection JSUnfilteredForInLoop
      box.push(`${key}=${params[key]}`);
    }
    if (typeof box[0] !== 'undefined') {
      actualUrl = `${actualUrl}?${box.join('&')}`;
    }
  }
  return actualUrl;
}

function _patchHeader(headers?: any) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    ...(_authorization() || {}),
    ...(headers || {}),
  };
}

async function _responseFilter(promise: Promise<Response>): Promise<Result | any> {
  try {
    const response = await promise;
    const url = response.url;
    if (!response.ok) {
      if (response.status == 403) {
        return {
          ResultInfo: '登录过期，请重新登录',
          ResultCode: response.status
        }
      } else {
        return {
          ResultInfo: '网络异常',
          ResultCode: response.status,
        }
      }
    }
    const result = await response.json();
    if (Utils.dev) {
      // console.log(`${url} --> `, result);
    }
    return result;
  } catch (e) {
    if (Utils.dev) {
      // console.error(e);
    }
    return {
      ResultInfo: '网络异常',
      ResultCode: 404,
    }
  }
}

function _authorization() {
//   if (!userId || !userPhone) return undefined;
  return {
    // Authorization: 'Base64.encode(`${userId}:${userPhone}`)',
    Authorization: User.getToken(),
  }
}

export default {
  ok: 0,
  post: async (url: string, body?: any, config?: HttpConfig) => {
    return await _responseFilter(fetch(_patchUrl(url), {
      body: typeof body === 'undefined' ? undefined : JSON.stringify(body),
      method: 'POST',
      headers: _patchHeader(Utils.retrieveProp(config, 'headers')),
      mode: "cors",
      cache: "force-cache"
    }));
  },

  get: async (url: string, params?: any, config?: HttpConfig) => {
    return await _responseFilter(fetch(_patchUrl(url, params), {
      method: 'GET',
      headers: _patchHeader(Utils.retrieveProp(config, 'headers')),
      mode: "cors",
      cache: "force-cache"
    }));
  },

  put: async (url: string, carray?: any, config?: HttpConfig) => {
    return await _responseFilter(fetch(_patchUrl(url), {
      body: typeof carray === 'undefined' ? undefined : JSON.stringify(carray),
      method: 'PUT',
      headers: _patchHeader(Utils.retrieveProp(config, 'headers')),
      mode: "cors",
      cache: "force-cache"
    }))
  },

  authorization: _authorization,

  fragment: async (url: string) => {
    return await fetch(_patchUrl(url), {
      method: 'GET',
    });
  },
}