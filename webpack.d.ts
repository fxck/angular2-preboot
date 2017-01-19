interface WebpackDevServerConfig {
  contentBase?: string;
  port?: number;
  historyApiFallback?: boolean;
  hot?: boolean;
  inline?: boolean;
  proxy?: any;
  host?: string;
  quiet?: boolean;
  noInfo?: boolean;
  watchOptions?: any;
};

interface WebpackConfig {
  cache?: boolean;
  target?: string;
  devtool?: string;
  entry: any;
  externals?: any;
  output: any;
  module?: any;
  plugins?: Array<any>;
  performance?: boolean | {
    hints?: string,
    assetFilter?: string,
    maxEntrypointSize?: string,
    maxAssetSize?: string
  };
  resolve?: {
    extensions?: Array<string>;
    modules?: Array<string>;
  };
  devServer?: WebpackDevServerConfig;
  node?: {
    process?: boolean;
    global?: boolean;
    Buffer?: boolean;
    crypto?: boolean;
    module?: boolean;
    clearImmediate?: boolean;
    setImmediate?: boolean
    clearTimeout?: boolean;
    setTimeout?: boolean;
    __dirname?: boolean;
    __filename?: boolean;
  };
}

interface IProjectConfig {
  head?: {
    link?: Array<{
      rel?: string;
      href?: string;
      crossorigin?: string;
      hreflang?: string;
      media?: string;
      rev?: string;
      sizes?: string;
      target?: string;
      type?: string;
    }>;
    meta?: Array<{
      charset?: string;
      content?: string;
      name?: string;
      type?: string;
      "=content"?: boolean;
    }>;
    title?: string;
  };
  build?: {
    common?: {
      plugins?: Array<any>;
      rules?: Array<any>;
    },
    dev?: {
      plugins?: Array<any>;
      rules?: Array<any>;
    };
    prod?: {
      plugins?: Array<any>;
      rules?: Array<any>;
    }
  },
  devServer?: {
    options?: WebpackDevServerConfig;
    port: number;
  },
  copy?: Array<{ from: string; to?: string; }>;
}

type DefaultConfig = {
  rules: any[];
  plugins: any[];
}

interface DefaultsLoaders {
  tsLintLoader?: {
    enforce?: any;
    test?: any;
    use?: any;
    exclude?: any;
  };
  sourceMapLoader?: {
    enforce?: any;
    test?: any;
    use?: any;
    exclude?: any;
  },
  tsLoader?: (aot: boolean) => {
    enforce?: any;
    test: any;
    use: any;
    exclude?: any;
  };
  jsonLoader: {
    enforce?: any;
    test?: any;
    use?: any;
    exclude?: any;
  };
  cssLoader?: {
    enforce?: any;
    test?: any;
    use?: any;
    exclude?: any;
  };
  htmlLoader?: {
    enforce?: any;
    test?: any;
    use?: any;
    exclude?: any;
  };
  fileLoader?: {
    enforce?: any;
    test?: any;
    use?: any;
    exclude?: any;
  };
};
