import { defineMessages } from 'react-intl'

const contextsMessages = {
  AuthContext: defineMessages({
    logOut: {
      id: 'contexts.AuthContext.logOut',
      defaultMessage: '您已被登出，目前有其他裝置登入這組帳號',
    },
  }),
}

export default contextsMessages
