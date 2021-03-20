import Cookies from 'js-cookie'

import Config from '@/settings'

const tokenKey = Config.tokenKey
const userKey = Config.userKey

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(tokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}

export function getUser() {
  return Cookies.get(userKey)
}

export function setUser(user, rememberMe) {
  if (rememberMe) {
    return Cookies.set(userKey, user, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(userKey, user)
}

export function clear() {
  Cookies.remove(tokenKey)
  Cookies.remove(userKey)
}
