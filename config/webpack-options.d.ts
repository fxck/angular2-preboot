export declare const EXCLUDE_SOURCEMAPS: any[];
export declare const COPY_FOLDERS: any[];
export declare const PLUGINS: {
  common: any[];
  dev: any[];
  prod: any[];
};
export declare const RULES: {
  defaults: {
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
  common: any[];
  dev: any[];
  prod: any[];
};
export declare const DEV_SERVER_OPTIONS: any;
export declare const BASE_URL: string;
