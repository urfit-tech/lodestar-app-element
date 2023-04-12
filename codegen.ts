require('dotenv-flow').config()
import { CodegenConfig } from '@graphql-codegen/cli'

console.log(process.env.NODE_ENV)
const config: CodegenConfig = {
  schema: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    './src/hasura.d.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        namingConvention: 'keep',
        omitOperationSuffix: true,
      },
    },
  },
  config: {
    headers: {
      'X-Hasura-Admin-Secret': process.env.HDB_ADMIN_SECRET,
    },
  },
  verbose: true,
}

export default config
