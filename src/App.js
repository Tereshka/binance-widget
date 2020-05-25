import React, {useEffect, useState, useRef} from 'react';
import { ThemeProvider, Box, Heading, Button, Flex } from "@chakra-ui/core";
import {customTheme} from './customTheme';
import Header from './widget/Header';
import Content from './widget/Content';
import { default as mockData }  from './data.json';

function App() {
  const url = 'https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products';
  const wsUrl = 'wss://stream.binance.com/stream?streams=!miniTicker@arr';
  const [products, setProducts] = useState(undefined);
  const [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('BTC');
  const [altsCategory, setAltsCategory] = useState('ALL');
  const [showColumn, setShowColumn] = useState("2");
  const [inComingData, setInComingData] = React.useState([]);
  const [webSocketStatus, setWebSocketStatus] = useState(false);
  const [orderBy, setOrderBy] = useState('name');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [searchValue, setSearchValue] = useState('');
  const webSocket = useRef(null);

  const fetchData = () => {
    fetch(url).then((res) => res.json)
    .then(data => {
      setProducts(data);
      connect();
    })
    // There is an error while loading because of CORS-policy, so getting data from mock
    .catch(err => {
      setProducts(mockData);
      connect();
    });
  }

  const selectData = () => {
    if (products === undefined) return;
    let array =[];
    if (altsCategory === 'ALL' || altsCategory === '') {
      array = products.data.filter(el => el.pm === selectedMarket);
    } else {
      array = products.data.filter(el => el.pm === selectedMarket && el.q === altsCategory);
    }
    array = sortData(array);
    setSortedData(prev => array);
  }

  const filterData = () => {
    const array = sortedData.filter(el => el.b.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredData(prev => array);
  }

  const sortData = (array) => {
    let newArray = [...array];
    if (orderBy === 'name') {
      newArray.sort((a, b) => {
        if (orderDirection === 'asc') {
          if (a.s < b.s) {
            return -1;
          }
          if (a.s > b.s) {
            return 1;
          }
        } else {
          if (a.s > b.s) {
            return -1;
          }
          if (a.s < b.s) {
            return 1;
          }
        }
        return 0;
      });
    }
    if (orderBy === 'price') {
      newArray.sort((a, b) => {
        if (orderDirection === 'asc') {
          return +a.c - +b.c;
        } else {
          return +b.c - +a.c;
        }
      });
    }
    if (orderBy === 'volume') {
      newArray.sort((a, b) => {
        if (orderDirection === 'asc') {
          return +a.qv - +b.qv;
        } else {
          return +b.qv - +a.qv;
        }
      });
    }
    if (orderBy === 'change') {
      newArray.sort((a, b) => {
        const changeA = (+a.o - +a.c).toFixed(8);
        const changeB = (+b.o - +b.c).toFixed(8);
        if (orderDirection === 'asc') {
          return changeA - changeB;
        } else {
          return changeB - changeA;
        }
      });
    }
    return newArray;
  }

  const connect = () => {
    webSocket.current = new WebSocket(wsUrl);

    webSocket.current.onopen = () => {
      console.log("Connected websocket");
      setWebSocketStatus(true);
    };

    webSocket.current.onmessage = (message) => {
      const {data} = JSON.parse(message.data);
      setInComingData(prev => data);
    };

    webSocket.current.onclose = e => {
      console.log('Socket is closed', e.reason);
      setWebSocketStatus(false);
    };

    webSocket.current.onerror = err => {
      console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
      );
      webSocket.current.close();
      setWebSocketStatus(false);
    };
  }

  const closeWebSocket = () => {
    webSocket.current.close();
  }

  const handleWebSocketButton = () => {
    if (webSocketStatus) {
      closeWebSocket();
    } else {
      connect();
    }
  }

  useEffect(() => {
    fetchData();
    return () => closeWebSocket();
  }, []);

  useEffect(() => {
    selectData();
    filterData();
  }, [products, selectedMarket, altsCategory]);

  useEffect(() => {
    if (!products) return;
    let newProducts = {...products};
    for(let i = 0; i < inComingData.length; i++) {
      let value = newProducts.data.find(el => el.s === inComingData[i].s);
      if (value) {
        value.qv = inComingData[i].q;
        value.c = inComingData[i].c;
        // value = {...value, ...inComingData[i]}; // fields are not the same, can't simple merge
      }
    }
    setProducts(newProducts);
  }, [inComingData]);

  useEffect(() => {
    let newArray = [...sortedData];
    newArray = sortData(newArray);
    setSortedData(prev => newArray);
  }, [orderBy, orderDirection, showColumn]);

  useEffect(() => {
    filterData();
  }, [searchValue]);

  return (
    <ThemeProvider theme={customTheme}>
      <Box mx="auto" width="90%">
        <Flex flexDirection='row' align='center' justifyContent='space-between'>
          <Heading as="h1">Market</Heading>
          <Button
            leftIcon="bell"
            variantColor={ webSocketStatus ? "green" : "red" }
            onClick={handleWebSocketButton}
          >{ webSocketStatus ? "Live" : "Offline" }</Button>
        </Flex>
        
        <main>
          <Header
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
            altsCategory={altsCategory}
            setAltsCategory={setAltsCategory}
            showColumn={showColumn}
            setShowColumn={setShowColumn}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Content
            data={filteredData}
            showColumn={showColumn}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            orderDirection={orderDirection}
            setOrderDirection={setOrderDirection}
          />
        </main>
      </Box>
    </ThemeProvider>
    
  );
}

export default App;
