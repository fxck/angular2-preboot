[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![taylor swift](https://img.shields.io/badge/secured%20by-taylor%20swift-brightgreen.svg)](https://twitter.com/SwiftOnSecurity)
[![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://github.com/auchenberg/volkswagen)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Angular 2.x Preboot

> An [Angular 2](https://angular.io) template that has a lot of features and is driven by great spirit.

## Features

* [Webpack 2](http://webpack.github.io/)
* [TypeScript](http://www.typescriptlang.org/)
* [@types](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&cad=rja&uact=8&ved=0ahUKEwjgjdrR7u_NAhUQ7GMKHXgpC4EQFggnMAI&url=https%3A%2F%2Fwww.npmjs.com%2F~types&usg=AFQjCNG2PFhwEo88JKo12mrw_4d0w1oNiA&sig2=N69zbO0yN8ET7v4KVCUOKA)
* [TsLint](http://palantir.github.io/tslint/)
* [Codelyzer](https://github.com/mgechev/codelyzer)
* [Istanbul](https://github.com/gotwarlost/istanbul)
* [Karma](https://karma-runner.github.io/)
* [Protractor](https://angular.github.io/protractor/)
* [Jasmine](https://github.com/jasmine/jasmine)
* [E2E](https://angular.github.io/protractor/#/faq#what-s-the-difference-between-karma-and-protractor-when-do-i-use-which-)
* [Docker](https://docker.io)

## Quick Start

> We have a [Yeoman](http://yeoman.io/generators/) in place that has your back.
> We support Node.js `>= 6.9.1` and NPM `>= 3.x` 
> We recommend and support [Visual Studio Code](https://code.visualstudio.com/)
> We recommend to use [NVM](https://github.com/creationix/nvm) to manage your Node.js version and depencies

### Install Yo and the Preboot Generator
```
npm i yo generator-angular2-preboot -g
  
```

### Setup a fresh Angular 2 project with the Preboot Generator
```
mkdir my-new-app && cd $_
```

```
yo angular2-preboot
```

### Start with your great project
```
npm start
```
go to [http://0.0.0.0:3000](http://0.0.0.0:3000) or [http://localhost:3000](http://localhost:3000) in your browser

### Build and deploy your great project
```
npm build && npm run build:docker
```

# License
 [MIT](/LICENSE)
