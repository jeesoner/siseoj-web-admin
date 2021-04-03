const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API

const api = {
  state: {
    // baseUrl
    baseApi: baseUrl
  }
}

export default api
