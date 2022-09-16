const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack").DefinePlugin;
const package_config = require("./package.json").config;

const common = {
    entry: "./src/index.ts",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")],
            },
            {
                test: /\.csv$/i,
                use: "raw-loader",
            },
            {
                test: /\.(png|ttf)$/,
                loader: "url-loader",
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    externals: {
        "pixi.js": "PIXI",
    },
};

const local = {
    ...common,

    name: "local",

    mode: "development",

    watch: true,

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "app.js",
        publicPath: "/",
    },

    devServer: {
        static: {
            directory: path.join(__dirname, "./dist"),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        compress: true,
        port: 9000,
        open: {
            app: {
                name: process.platform == "linux" ? "google-chrome" : "Chrome",
            },
        },
    },

    devtool: "eval-cheap-module-source-map",

    plugins: [
        new DefinePlugin({
            __ENVIRONMENT__: `"LOCAL"`,
        }),
        new CopyPlugin({
            patterns: package_config.LOCAL_DEV
                ? [
                      {
                          from: "./page/local.html",
                          to: "./index.html",
                      },
                      { from: "./assets", to: "./assets" },
                      { from: "./libs", to: "./libs" },
                  ]
                : [
                      {
                          from: "./page/index.html",
                          to: "./index.html",
                      },
                      { from: "./assets", to: "./assets" },
                  ],
        }),
    ],
};

const localNoOpen = {
    ...local,

    name: "local!",

    devServer: {
        static: {
            directory: path.join(__dirname, "./dist"),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        compress: true,
        port: 9000,
    },
};

const dev = {
    ...common,

    name: "dev",

    mode: "development",

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "app.js",
        publicPath: "/",
    },

    devtool: "eval-cheap-module-source-map",

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "./page/index.html", to: "./index.html" },
                { from: "./assets", to: "./assets" },
            ],
        }),
        new DefinePlugin({
            __ENVIRONMENT__: `"DEV"`,
        }),
    ],
};

const prod = {
    ...common,

    name: "prod",

    mode: "production",

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "app.js",
        publicPath: "/",
    },

    devtool: false,

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "./page/prodIndex.html", to: "./index.html" },
                { from: "./assets", to: "./assets" },
            ],
        }),
        new DefinePlugin({
            __ENVIRONMENT__: `"PROD"`,
        }),
    ],
};

module.exports = [local, dev, prod, localNoOpen];
