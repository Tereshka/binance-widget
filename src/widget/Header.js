import React, {useContext} from 'react';
import {AppContext} from '../App';
import {
  SET_SELECTED_MARKET,
  SET_ALTS_CATEGORY,
  SET_USD_CATEGORY,
  SET_ORDER_BY,
  SET_SHOWN_COLUMN,
  SET_SEARCH_VALUE,
} from '../widgetActions';

import {
  Flex,
  Button,
  Icon,
  Radio,
  RadioGroup,
  RadioButtonGroup,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/core';

const CustomRadio = React.forwardRef((props, ref) => {
  const { isChecked, isDisabled, children, ...rest } = props;
  return (
    <Button
      ref={ref}
      variantColor={isChecked ? 'orange' : 'gray'}
      aria-checked={isChecked}
      role='radio'
      cursor='pointer'
      mt='12px'
      isDisabled={isDisabled}
      {...rest}
    >
      {children}
    </Button>
  );
});

const CustomSelect = React.forwardRef((props, ref) => {
  const { isDisabled, value, onChange, children, ...rest } = props;
  return (
    <Select
      size='sm'  ml='5'
      rounded='20px' variant='filled'
      placeholder='ALL' w='100px'
      backgroundColor='gray.700'
      borderColor='gray.700'
      color='white'
      _active={{ bg: 'gray.700', color: 'white' }}
      _hover={{ bg: 'gray.700', color: 'white' }}
      _focus={{ bg: 'gray.700', color: 'white' }}
      isDisabled={isDisabled}
      value={value}
      onChange={onChange}
      {...rest}
    >
      {children}
    </Select>
  );
});

function Header() {
  const { state, dispatch } = useContext(AppContext);
  const {
    selectedMarket,
    altsCategory,
    usdCategory,
    showColumn,
    orderBy,
    searchValue,
  } = state;
  const altsCategoryValues = ['XRP', 'ETH', 'TRX'];
  const usdCategoryValues = ['USDT', 'BUSD', 'TUSD', 'USDC', 'PAX', 'BKRW', 'EUR', 'IDRT', 'NGN', 'RUB', 'TRY', 'ZAR'];

  const onMarketChanged = (event) => {
    if (event !== selectedMarket) {
      dispatch({ type: SET_SELECTED_MARKET, payload: event });
      dispatch({ type: SET_ALTS_CATEGORY, payload: 'ALL' });
      dispatch({ type: SET_USD_CATEGORY, payload: 'ALL' });
    }
  }

  const onAltsCategoryChanged = (event) => {
    event.persist();
    dispatch({ type: SET_ALTS_CATEGORY, payload: event.target.value });
  }

  const onUsdCategoryChanged = (event) => {
    event.persist();
    dispatch({ type: SET_USD_CATEGORY, payload: event.target.value });
  }

  const onColumnChange = (event) => {
    dispatch({ type: SET_SHOWN_COLUMN, payload: event.target.value });
    if (['change', 'volume'].includes(orderBy)) {
      dispatch({ type: SET_ORDER_BY, payload: orderBy === 'change' ? 'volume' : 'change' });
    }
  }

  return (
    <Flex flexDirection='row' alignItems='center' flexWrap='wrap'>
      <RadioButtonGroup
        value={selectedMarket}
        onChange={onMarketChanged}
        isInline
        mr='12px'
      >
        <CustomRadio value='FAVOURITE'><Icon name='star' size='12px' /></CustomRadio>
        <CustomRadio value='BNB'>BNB</CustomRadio>
        <CustomRadio value='BTC'>BTC</CustomRadio>
        <CustomRadio value='ALTS'>ALTS
          <CustomSelect
            isDisabled={selectedMarket !== 'ALTS'}
            onChange={onAltsCategoryChanged}
            value={altsCategory}
          >
            {
              altsCategoryValues.map(el =>
                <option key={`key-alts-category-${el}`} value={el}>{el}</option>
              )
            }
          </CustomSelect>
        </CustomRadio>
        <CustomRadio value='USDⓈ'>USDⓈ
          <CustomSelect
            isDisabled={selectedMarket !== 'USDⓈ'}
            onChange={onUsdCategoryChanged}
            value={usdCategory}
          >
            {
              usdCategoryValues.map(el =>
                <option key={`key-usd-category-${el}`} value={el}>{el}</option>
              )
            }
          </CustomSelect>
        </CustomRadio>
      </RadioButtonGroup>
      <RadioGroup mt='12px'
        value={showColumn}
        onChange={onColumnChange}
        isInline
        mr='12px'
      >
        <Radio value='1' size='sm' variantColor='orange' fontFamily='body' borderColor='gray.700'>Change</Radio>
        <Radio value='2' size='sm' variantColor='orange' fontFamily='body' borderColor='gray.700'>Volume</Radio>
      </RadioGroup>
      <InputGroup size='sm' mt='12px'>
        <InputLeftElement children={<Icon size='16px' name='search' color='orange.300' />} />
        <Input 
          value={searchValue}
          onChange={e => dispatch({ type: SET_SEARCH_VALUE, payload: e.target.value })}
          placeholder='ADA' textTransform='uppercase'
          width='80px' variant='filled'
          focusBorderColor='none' outline='none' border='none'
          _active={{ bg: 'gray.100', color: 'gray.700' }}
          _hover={{ bg: 'gray.100', color: 'gray.700' }}
          _focus={{ bg: 'gray.100', color: 'gray.700' }}
        />
        <InputRightElement
          children={<Icon name='close' color='gray.500' />}
          cursor="pointer"
          onClick={() => dispatch({ type: SET_SEARCH_VALUE, payload: '' })}
        />
      </InputGroup>
    </Flex>
  );
}

export default Header;