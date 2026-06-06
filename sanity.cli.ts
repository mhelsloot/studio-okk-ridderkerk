import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'w9xl6m4j',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: false,
  },
})
