import {
  SET_PRODUCTS,
  UPDATE_PRODUCTS,
  SET_SORTED_DATA,
  WEBSOCKET_IS_ALIVE,
  SET_SELECTED_MARKET,
  SET_ALTS_CATEGORY,
  SET_USD_CATEGORY,
  SET_ORDER_BY,
  SET_ORDER_DIRECTION,
  SET_SHOWN_COLUMN,
  SET_SEARCH_VALUE,
  TOGGLE_FAVOURITE,
} from './widgetActions';

const initialState = {
  products: undefined,
  sortedData: [],
  filteredData: [],
  favouriteList: [],
  selectedMarket: 'BTC',
  altsCategory: 'ALL',
  usdCategory: 'ALL',
  showColumn: '2',
  websocketIsAlive: false,
  orderBy: 'name',
  orderDirection: 'asc',
  searchValue: '',
};

function widgetReducer(state, action) {
  switch (action.type) {
    case SET_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
      };
    }
    case UPDATE_PRODUCTS: {
      let incomingData = action.payload;
        let newProducts = {...state.products};
        for(let i = 0; i < incomingData.length; i++) {
          let value = newProducts.data.find(el => el.s === incomingData[i].s);
          if (value) {
            value.qv = incomingData[i].q;
            value.c = incomingData[i].c;
            // value = {...value, ...inComingData[i]}; // fields are not the same, can't simple merge
          }
        }
      return {
        ...state,
        products: newProducts,
      };
    }
    case SET_SORTED_DATA: {
      const {sortedData, filteredData } =
        sortAndFilterData(action.payload, state.orderBy, state.orderDirection, state.searchValue);
      return {
        ...state,
        sortedData,
        filteredData,
      };
    }
    case WEBSOCKET_IS_ALIVE: {
      return {
        ...state,
        websocketIsAlive: action.payload,
      };
    }
    case SET_SELECTED_MARKET: {
      return {
        ...state,
        selectedMarket: action.payload,
      };
    }
    case SET_ALTS_CATEGORY: {
      return {
        ...state,
        altsCategory: action.payload,
      };
    }
    case SET_USD_CATEGORY: {
      return {
        ...state,
        usdCategory: action.payload,
      };
    }
    case SET_ORDER_BY: {
      const {sortedData, filteredData } =
        sortAndFilterData(state.sortedData, action.payload, state.orderDirection, state.searchValue);
      return {
        ...state,
        orderBy: action.payload,
        sortedData,
        filteredData,
      };
    }
    case SET_ORDER_DIRECTION: {
      const {sortedData, filteredData } =
        sortAndFilterData(state.sortedData, state.orderBy, action.payload, state.searchValue);
      return {
        ...state,
        orderDirection: action.payload,
        sortedData,
        filteredData,
      };
    }
    case SET_SHOWN_COLUMN: {
      return {
        ...state,
        showColumn: action.payload,
      };
    }
    case SET_SEARCH_VALUE: {
      const filteredData = filterData(state.sortedData, action.payload);
      return {
        ...state,
        filteredData,
        searchValue: action.payload,
      };
    }
    case TOGGLE_FAVOURITE: {
      let {isFavourite, value} = action.payload;
      let favList = [...state.favouriteList];
      if (isFavourite) {
        favList = favList.filter(el => el !== value);
      } else {
        favList.push(value);
      }
      return {
        ...state,
        favouriteList: favList,
      };
    }
    default:
      return state;
  }
}

const sortAndFilterData = (data, orderBy, orderDirection, searchValue) => {
  const sortedData = sortData(data, orderBy, orderDirection);
  const filteredData = filterData(sortedData, searchValue);
  return {sortedData, filteredData};
}

const filterData = (array, searchValue) => {
  const newArray = array.filter(el => el.b.toLowerCase().includes(searchValue.toLowerCase()));
  return newArray;
}

const sortData = (array, orderBy, orderDirection) => {
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

export {initialState, widgetReducer};