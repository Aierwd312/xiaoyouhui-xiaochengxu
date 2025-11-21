const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName: state => state.user.nickName,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userInfo: state => state.user
}
export default getters
