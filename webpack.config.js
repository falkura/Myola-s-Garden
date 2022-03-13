/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack").DefinePlugin;

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
            {
                test: /\.tmx?$/,
                loader: "tmx-loader",
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    externals: {
        "pixi.js": "PIXI",
        Howler: "Howler",
        Howl: "Howl",
        FontFaceObserver: "FontFaceObserver",
        anime: "anime",
    },
};

const local = {
    ...common,

    name: "local",

    mode: "development",

    watch: true,

    output: {
        path: path.join(__dirname, "dist"),
        filename: "app.js",
        publicPath: "/dist",
    },

    devServer: {
        contentBase: path.join(__dirname, "/"),
        compress: true,
        port: 9000,
        open: {
            app: ["Chrome"],
        },
        // openPage: "?showcheats=true",
        historyApiFallback: {
            rewrites: [
                { from: /.*\/dist\/app\.js/, to: "/dist/app.js" },
                { from: /.*/, to: "./index.html" },
            ],
        },
    },

    devtool: "eval-cheap-module-source-map",

    plugins: [
        new DefinePlugin({
            __ENVIRONMENT__: `"DEV"`,
        }),
    ],
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
            patterns: [{ from: "./assets", to: "./assets" }],
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

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{ from: "./assets", to: "./assets" }],
        }),
        new DefinePlugin({
            __ENVIRONMENT__: `"PROD"`,
        }),
    ],
};

module.exports = [local, dev, prod];
