# Binance Widget [LIVE DEMO](https://tereshka.github.io/binance-widget)
This is a test task to make market widget using React.<br/>
You can:<br/>
- select any market<br />
- choose a category, if selected market has any
- filter coins by name<br/>
- choose last column view: volume or change (I'm not in finance field, so I show difference between open and latest prices)<br />
- order data by clicking on column titles<br/>
- add coins to favourite list<br/>
- stop websocket stream and rerun it for getting updated data<br/>

Used technologies: React, React hooks (useReducer, useContext), fetching REST API, websockets, chakra-ui<br />
Rest API: `https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products`<br />
WebSocket API: `wss://stream.binance.com/stream?streams=!miniTicker@arr`<br />

## Available Scripts

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### `npm test`

Launches the test runner in the interactive watch mode

### `npm run build`

Builds the app for production to the `build` folder

### `npm run deploy`

Deploy project on github-pages