module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
        externals: ['sqlite3'],
        nodeIntegration: true,
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          files: [
            "**/*"
          ],
          extraFiles: [
            {
                "from": "src/assets",
                "to": "",
                "filter": ["**/*"]
            },
            {
                "from": "public",
                "to": "public",
                "filter": ["**/*"]
            }
          ]
        }
      },
    }
}
