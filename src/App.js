import React, {useEffect, useRef, useReducer, createContext} from 'react';
import { ThemeProvider, Box, Heading, Button, Flex } from '@chakra-ui/core';
import customTheme from './customTheme';
import Header from './widget/Header';
import Content from './widget/Content';
import { default as mockData }  from './data.json';
import {initialState, widgetReducer} from './widgetReducer';

export const AppContext = createContext();

function App() {
  const url = 'https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products';
  const wsUrl = 'wss://stream.binance.com/stream?streams=!miniTicker@arr';
  const webSocket = useRef(null);

  const [state, dispatch] = useReducer(widgetReducer, initialState);
  const {
    products,
    favouriteList,
    selectedMarket,
    altsCategory,
    usdCategory,
    websocketIsAlive,
  } = state;
  
  const connect = () => {
    webSocket.current = new WebSocket(wsUrl);

    webSocket.current.onopen = () => {
      console.log('Connected websocket');
      dispatch({ type: 'websocketIsAlive', payload: true });
    };

    webSocket.current.onmessage = (message) => {
      const {data} = JSON.parse(message.data);
      dispatch({ type: 'updateProducts', payload: data });
    };

    webSocket.current.onclose = e => {
      console.log('Socket is closed', e.reason);
      dispatch({ type: 'websocketIsAlive', payload: false });
    };

    webSocket.current.onerror = err => {
      console.error(
          'Socket encountered error: ',
          err.message,
          'Closing socket'
      );
      webSocket.current.close();
      dispatch({ type: 'websocketIsAlive', payload: false });
    };
  }

  const closeWebSocket = () => {
    webSocket.current.close();
  }

  const handleWebSocketButton = () => {
    if (websocketIsAlive) {
      closeWebSocket();
    } else {
      connect();
    }
  }

  useEffect(() => {
    const fetchData = () => {
      fetch(url).then((res) => res.json)
      .then(data => {
        dispatch({ type: 'products', payload: data });
        connect();
      })
      // There is an error while loading on localhost because of CORS-policy, so getting data from mock
      .catch(err => {
        dispatch({ type: 'products', payload: mockData });
        connect();
      });
    }

    fetchData();

    return () => closeWebSocket();
  }, []);

  useEffect(() => {
    const selectData = () => {
      if (products === undefined) return;
      let array =[];
      if (selectedMarket === 'FAVOURITE') {
        array = products.data.filter(el => favouriteList.includes(el.s));
      } else if (altsCategory !== 'ALL' && altsCategory !== '' && usdCategory === 'ALL') {
        array = products.data.filter(el => el.pm === selectedMarket && el.q === altsCategory);
      } else if (usdCategory !== 'ALL' && usdCategory !== '' && altsCategory === 'ALL') {
        array = products.data.filter(el => el.pm === selectedMarket && el.q === usdCategory);
      } else {
        array = products.data.filter(el => el.pm === selectedMarket);
      }

      dispatch({ type: 'sortedData', payload: array });
    }

    selectData();
  }, [products, selectedMarket, altsCategory, usdCategory, favouriteList]);

  return (
    <ThemeProvider theme={customTheme}>
      <AppContext.Provider value={{ state, dispatch }}>
      <Box mx='auto' width='90%'>
        <Flex flexDirection='row' align='center' justifyContent='space-between'>
          <Heading as='h1'>Market</Heading>
          <Button
            leftIcon='bell'
            variantColor={ websocketIsAlive ? 'green' : 'red' }
            onClick={handleWebSocketButton}
          >{ websocketIsAlive ? 'Live' : 'Offline' }</Button>
        </Flex>
        <main>
          <Header/>
          <Content/>
        </main>
      </Box>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
