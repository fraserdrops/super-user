# super-user

## Getting started

### Frontend

`cd frontend`
`npm install`

`npm start` to run local dev server on `localhost:3000`

`npm run test` runs tests

`npm run build` creates a production build in dir /build

`npm run publish` runs tests, and creates a build if they pass

### Backend

`cd frontend`
`npm install`

`npm start` to run dev server on `localhost:5000`

ts-node-dev will watch files and restart server on changes

`npm run build` to compile to /build

`cd build && node index.js` to run the built server on `localhost:5000`
