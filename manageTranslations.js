/*
 * This script takes the extracted string outputted by babel-react-intl plugin
 * and generates two files per supported locale. This library tracks translations
 * and makes sure there are no duplicate keys
 */
const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  messagesDirectory: 'build/messages/',
  translationsDirectory: 'src/translations/locales/',
  whitelistsDirectory: 'src/translations/locales/whitelists/',
  languages: ['zh-tw', 'zh-cn', 'en-us', 'vi', 'id', 'ja', 'ko', 'de-de'],
})
