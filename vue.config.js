module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            config.output.filename = "js/[name].[contenthash].js";
            config.output.chunkFilename = "js/[name].[contenthash].js";
        }
    }
}
