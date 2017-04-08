cyber-school v1

Front-end:

React
React-bootstrap
Redux
Back-end:

Node.js
Database:

Firebase
React Redux Starter Kit

Join the chat at https://gitter.im/davezuko/react-redux-starter-kit Build Status dependencies devDependency Status js-standard-style

This starter kit is designed to get you up and running with a bunch of awesome new front-end technologies, all on top of a configurable, feature-rich webpack build system that's already setup to provide hot reloading, CSS preprocessing with Sass, unit testing, code coverage reports, bundle splitting, and more.

The primary goal of this project is to remain as unopinionated as possible. Its purpose is not to dictate your project structure or to demonstrate a complete sample application, but to provide a set of tools intended to make front-end development robust, easy, and, most importantly, fun. Check out the full feature list below!

Finally, This project wouldn't be possible without the help of our many contributors, so thank you for all of your help.

Table of Contents

Features
Requirements
Getting Started
Application Structure
Development
Developer Tools
Routing
Testing
Deployment
Build System
Configuration
Globals
Styles
Server
Production Optimization
Learning Resources
FAQ
Thank You
Features

react
redux
react-router
webpack
babel
express
karma
eslint
Requirements

node ^4.5.0
yarn ^0.17.0 or npm ^3.0.0
Getting Started

After confirming that your development environment meets the specified requirements, you can create a new project based on react-redux-starter-kit by doing the following:

Install from source

First, clone the project:

$ git clone https://github.com/davezuko/react-redux-starter-kit.git <my-project-name>
$ cd <my-project-name>
Then install dependencies and check to see it works. It is recommended that you use Yarn for deterministic installs, but npm install will work just as well.

$ yarn install    # Install project dependencies
$ yarn start      # Compile and launch (same as `npm start`)
If everything works, you should see the following:



While developing, you will probably rely mostly on npm start; however, there are additional scripts at your disposal:

npm run <script>	Description
start	Serves your app at localhost:3000. HMR will be enabled in development.
compile	Compiles the application to disk (~/dist by default).
dev	Same as npm start, but enables nodemon for the server as well.
test	Runs unit tests with Karma and generates a coverage report.
test:dev	Runs Karma and watches for changes to re-run tests; does not generate coverage reports.
deploy	Runs linter, tests, and then, on success, compiles your application to disk.
deploy:dev	Same as deploy but overrides NODE_ENV to "development".
deploy:prod	Same as deploy but overrides NODE_ENV to "production".
lint	Lint all .js files.
lint:fix	Lint and fix all .js files. Read more on this.
Application Structure

The application structure presented in this boilerplate is fractal, where functionality is grouped primarily by feature rather than file type. Please note, however, that this structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications. If you wish to read more about this pattern, please check out this awesome writeup by Justin Greenberg.

.
├── bin                      # Build/Start scripts
├── config                   # Project and build configurations
├── public                   # Static public assets (not imported anywhere in source code)
├── server                   # Express application that provides webpack middleware
│   └── main.js              # Server application entry point
├── src                      # Application source code
│   ├── index.html           # Main HTML page container for app
│   ├── main.js              # Application bootstrap and rendering
│   ├── components           # Global Reusable Presentational Components
│   ├── containers           # Global Reusable Container Components
│   ├── layouts              # Components that dictate major page structure
│   │   └── CoreLayout.js    # CoreLayout which receives children for each route
│   │   └── CoreLayout.scss  # Styles related to the CoreLayout
│   │   └── index.js         # Main file for layout
│   ├── routes               # Main route definitions and async split points
│   │   ├── index.js         # Bootstrap main application routes with store
│   │   ├── Home             # Fractal route
│   │   │   ├── index.js     # Route definitions and async split points
│   │   │   ├── assets       # Assets required to render components
│   │   │   ├── components   # Presentational React Components
│   │   │   └── routes **    # Fractal sub-routes (** optional)
│   │   └── Counter          # Fractal route
│   │       ├── index.js     # Counter route definition
│   │       ├── container    # Connect components to actions and store
│   │       ├── modules      # Collections of reducers/constants/actions
│   │       └── routes **    # Fractal sub-routes (** optional)
│   ├── store                # Redux-specific pieces
│   │   ├── createStore.js   # Create and instrument redux store
│   │   └── reducers.js      # Reducer registry and injection
│   └── styles               # Application-wide styles (generally settings)
└── tests                    # Unit tests
Development

Developer Tools

We recommend using the Redux DevTools Chrome Extension. Using the chrome extension allows your monitors to run on a separate thread and affords better performance and functionality. It comes with several of the most popular monitors, is easy to configure, filters actions, and doesn’t require installing any packages.

However, adding the DevTools components to your project is simple. First, grab the packages from npm:

npm i --save-dev redux-devtools redux-devtools-log-monitor redux-devtools-dock-monitor
Then follow the manual integration walkthrough.

Routing

We use react-router route definitions (<route>/index.js) to define units of logic within our application. See the application structure section for more information.

Testing

To add a unit test, simply create a .spec.js file anywhere in ~/tests. Karma will pick up on these files automatically, and Mocha and Chai will be available within your test without the need to import them. Coverage reports will be compiled to ~/coverage by default. If you wish to change what reporters are used and where reports are compiled, you can do so by modifying coverage_reporters in ~/config/project.config.js.

Deployment

Out of the box, this starter kit is deployable by serving the ~/dist folder generated by npm run deploy (make sure to specify your target NODE_ENV as well). This project does not concern itself with the details of server-side rendering or API structure, since that demands an opinionated structure that makes it difficult to extend the starter kit. However, if you do need help with more advanced deployment strategies, here are a few tips:

Static Deployments

If you are serving the application via a web server such as nginx, make sure to direct incoming routes to the root ~/dist/index.html file and let react-router take care of the rest. If you are unsure of how to do this, you might find this documentation helpful. The Express server that comes with the starter kit is able to be extended to serve as an API or whatever else you need, but that's entirely up to you.

Build System

Configuration

Default project configuration can be found in ~/config/project.config.js. Here you'll be able to redefine your src and dist directories, adjust compilation settings, tweak your vendor dependencies, and more. For the most part, you should be able to make changes in here without ever having to touch the actual webpack build configuration.

If you need environment-specific overrides (useful for dynamically setting API endpoints, for example), you can edit ~/config/environments.config.js and define overrides on a per-NODE_ENV basis. There are examples for both development and production, so use those as guidelines. Here are some common configuration options:

Key	Description
dir_src	application source code base path
dir_dist	path to build compiled application to
server_host	hostname for the Express server
server_port	port for the Express server
compiler_devtool	what type of source-maps to generate (set to false/null to disable)
compiler_vendor	packages to separate into to the vendor bundle
Webpack is configured to make use of resolve.root, which lets you import local packages as if you were traversing from the root of your ~/src directory. Here's an example:

// current file: ~/src/views/some/nested/View.js
// What used to be this:
import SomeComponent from '../../../components/SomeComponent'

// Can now be this:
import SomeComponent from 'components/SomeComponent' // Hooray!
Globals

These are global variables available to you anywhere in your source code. If you wish to modify them, they can be found as the globals key in ~/config/project.config.js. When adding new globals, make sure you also add them to ~/.eslintrc.

Variable	Description
process.env.NODE_ENV	the active NODE_ENV when the build started
__DEV__	True when process.env.NODE_ENV is development
__PROD__	True when process.env.NODE_ENV is production
__TEST__	True when process.env.NODE_ENV is test
Styles

Both .scss and .css file extensions are supported out of the box. After being imported, styles will be processed with PostCSS for minification and autoprefixing, and will be extracted to a .css file during production builds.

Server

This starter kit comes packaged with an Express server. It's important to note that the sole purpose of this server is to provide webpack-dev-middleware and webpack-hot-middleware for hot module replacement. Using a custom Express app in place of webpack-dev-server makes it easier to extend the starter kit to include functionality such as API's, universal rendering, and more -- all without bloating the base boilerplate.

Production Optimization

Babel is configured to use babel-plugin-transform-runtime so transforms aren't inlined. In production, webpack will extract styles to a .css file, minify your JavaScript, and perform additional optimizations such as module deduplication.

Learning Resources

Starting out with react-redux-starter-kit is an introduction to the components used in this starter kit with a small example in the end.
FAQ

Having trouble? Check out our FAQ or submit an issue. Please be considerate by only posting issues that are directly related to this project; questions about how to implement certain React or Redux features are both best suited for StackOverflow or their respective repositories.

Thank You

This project wouldn't be possible without help from the community, so I'd like to highlight some of its biggest contributors. Thank you all for your hard work, you've made my life a lot easier and taught me a lot in the process.

Justin Greenberg - For all of your PR's, getting us to Babel 6, and constant work improving our patterns.
Roman Pearah - For your bug reports, help in triaging issues, and PR contributions.
Spencer Dixon - For your creation of redux-cli.
Jonas Matser - For your help in triaging issues and unending support in our Gitter channel.
And to everyone else who has contributed, even if you are not listed here your work is appreciated.
