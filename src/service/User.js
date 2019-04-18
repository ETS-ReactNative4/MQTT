// @flow

export const UserState = {
  preregister: 0,
  registered: 1,
  identifying: 2,
  identified: 3,
  unidentified: 4,
};

export const UserType = {
  normal: '0',
  partner: '1',
  distributor: '2',
  dealer: '3',
};

export const UserGender = {
  male: '0',
  female: '1',
  unknown: '2',
};

export type UserInfo = {
  AuditRemark?: string,
  RealName: string,
  RealNameAuthenticationState: string,
  Sex: '0' | '1' | '2',  // 性别 ’0‘男 ’1‘ 女 ’2‘保密
  Address?: string,
  Province?: string,
  City?: string,
  Email?: string,
  Company?: string,
  Department?: string,
  TelWork?: string, // 工作电话
  TelCell?: string, // 手机号
  Title?: string, // 职位
  CardUrl?: string, // 名片URL
  RawCardUrl?: string, // 原名片URL
  PSPDId?: string, // 证件号码
  PSPDIdIconBack?: string, // 手持背面
  PSPDIdIconFront?: string, // 手持正面
  BusinessCategory?: string, // 经营品类
  BusinessCategoryName?: string, // 经营品类
  EditWhen?: string, // 提交审核时间
  HeadImageUrl: string,
  MobileNumber: string,
  NickName?: string,
  PrizeState: string,
  ReferenceUserId: string,
  UserName?: string,
  UserId: string,
  UserState: 0 | 1 | 2 | 3 | 4, // 用户状态 （0-预注册 1-注册用户2-已提交名片 3-名片审核通过 4-名片审核未通过
  UserType: '0' | '1' | '2' | '3', //用户类型（普通用户 0 经销商 3 分销商 2 合伙人 1）
}

const _userStorageKey = 'user';
let _userCache: ?UserInfo = null;

function _get(): ?UserInfo {
  if (!_userCache) {
    const _userJson = sessionStorage.getItem(_userStorageKey);
    if (_userJson) {
      _userCache = JSON.parse(_userJson);
      _userCache.userPhone = '18362981127';
      _userCache.userId = 'f3157afc-0270-11e8-86ce-00163e0070dd';
    }
  }
  return _userCache;
}

export default {
  put: (user: UserInfo) => {
    _userCache = user;
    sessionStorage.setItem(_userStorageKey, JSON.stringify(_userCache));
  },

  get: _get,

  getId: () => {
    const user = _get();
    return user ? user.UserId : '';
  },

  getPhone: () => {
    const user = _get();
    return user ? user.MobileNumber : '';
  },
  getToken: () => {
    return sessionStorage.getItem('Access_token');
  },

  modify: (newer: any) => {
    _userCache = { ..._userCache, ...newer };
    sessionStorage.setItem(_userStorageKey, JSON.stringify(_userCache));
  },

  drop: () => {
    _userCache = null;
    sessionStorage.removeItem(_userStorageKey);
  },

  validate: () => !!_get(),

  identified: () => {
    const user = _get();
    return !!user && user.UserState === UserState.identified;
  },

  isAgent: () => {
    const user = _get();
    return !!user && user.isAgent;
  },

  isVip: () => {
    const user = _get();
    return !!user && user.isVip;
  },

  updataToken: (access_token, refresh_token) => {
    sessionStorage.setItem('Access_token', access_token);
    sessionStorage.setItem('Refresh_token', refresh_token);
  }
}
