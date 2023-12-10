const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  //path.resove(__dirname) : the project abs directory
  //entry: path.resolve(__dirname, "src/index.js"),
  //Set the entry as an object(for code splitting..)
  entry: {
    bundle: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    //manually set the bundled file -otherwise the default is main.js
    //IMPORTANT - ADD HASH FOR CASHING OF WEBPACK
    //filename: "bundle.js",
    //NOTE the 'name' is the property name I gave in the entry
    filename: "[name][contenthash].js",
    //Prevent the extra added bundler in each build
    clean: true,

    //IMPORTANT: keep the original file name of the logo - dont hash  it
    assetModuleFilename: "[name][ext]",
    //manually set the bundled file -otherwise the default is main.js
  },

  //IMPORTANT: FOR DEBUGGING - GET A MAP FROM DIST TO MY SRC TO SEE WHERE THE ERROR!
  //NOW FOR EACH BUILD I WILL GET THE FILE:dist/bundle.HASH.js.map !
  devtool: "source-map",

  /*******************************
   *Serve from the dist folder 
   port(for frontend - commonly 3000)
   open:true - when run npm run dev - it will open the browser
   hot:true - hot reload
   compraess :true - for gzip compression
   ************************************/
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },

  /*
  IMPORTANT: 
  for each file type - apply(use)the correspoing loader!
  */
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      //BABEL Config - LOADER(if needed...)
      {
        test: /\.js$/,
        //IMPORTANT - EXCLUDE node_modules - EXCLUDE THEM
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      //ASSET RESOURCE LOADER - NO NEED TO INSTALL! BUILT IN WEBPACK5
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  //PLUGINS : Used to automate tasks (create the index.html file etc..)
  //IMPORTANT : the object properties - will be injected in the template.html file!
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack App",
      filename: "index.html",
      template: "src/template.html",
    }),
    new BundleAnalyzerPlugin(),
  ],
};
