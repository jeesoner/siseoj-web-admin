const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  roles: state => state.user.roles,
  baseApi: state => state.api.baseApi
}
export default getters
