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
    case 'products': {
      return {
        ...state,
        products: action.payload,
      };
    }
    case 'updateProducts': {
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
    case 'sortedData': {
      const {sortedData, filteredData } =
        sortAndFilterData(action.payload, state.orderBy, state.orderDirection, state.searchValue);
      return {
        ...state,
        sortedData,
        filteredData,
      };
    }
    case 'filteredData': {
      const filteredData = filterData(state.sortedData, state.searchValue);
      return {
        ...state,
        filteredData,
      };
    }
    case 'websocketIsAlive': {
      return {
        ...state,
        websocketIsAlive: action.payload,
      };
    }
    case 'selectedMarket': {
      return {
        ...state,
        selectedMarket: action.payload,
      };
    }
    case 'altsCategory': {
      return {
        ...state,
        altsCategory: action.payload,
      };
    }
    case 'usdCategory': {
      return {
        ...state,
        usdCategory: action.payload,
      };
    }
    case 'orderBy': {
      const {sortedData, filteredData } =
        sortAndFilterData(state.sortedData, action.payload, state.orderDirection, state.searchValue);
      return {
        ...state,
        orderBy: action.payload,
        sortedData,
        filteredData,
      };
    }
    case 'orderDirection': {
      const {sortedData, filteredData } =
        sortAndFilterData(state.sortedData, state.orderBy, action.payload, state.searchValue);
      return {
        ...state,
        orderDirection: action.payload,
        sortedData,
        filteredData,
      };
    }
    case 'showColumn': {
      return {
        ...state,
        showColumn: action.payload,
      };
    }
    case 'searchValue': {
      const filteredData = filterData(state.sortedData, action.payload);
      return {
        ...state,
        filteredData,
        searchValue: action.payload,
      };
    }
    case 'toggleFavourite': {
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