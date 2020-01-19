export const enum DefaultRegex {
  default = '[A-zÀ-ÿ ]*',
  userName = '^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$',
  secureUrl = 'https:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)'
}
