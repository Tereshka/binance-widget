import React from 'react';
import {
  Flex,
  Button,
  Icon,
  Radio,
  RadioGroup,
  RadioButtonGroup,
  Select,
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
      size="sm"  ml="5"
      rounded="20px" variant="filled"
      placeholder="ALL" w="100px"
      backgroundColor="black"
      borderColor="black"
      color="white"
      _active={{ bg: "black", color: "white" }}
      _hover={{ bg: "black", color: "white" }}
      _focus={{ bg: "black", color: "white" }}
      isDisabled={isDisabled}
      value={value}
      onChange={onChange}
      {...rest}
    >
      {children}
    </Select>
  );
});

function Header(props) {
  const {
    selectedMarket,
    setSelectedMarket,
    altsCategory,
    setAltsCategory,
    showColumn,
    setShowColumn,
  } = props;
  const altsCategoryValues = ['XRP', 'ETH', 'TRX'];
  const usdCategoryValues = ['USDT', 'BUSD', 'TUSD', 'USDC', 'PAX', 'BKRW', 'EUR', 'IDRT', 'NGN', 'RUB', 'TRY', 'ZAR'];

  const onMarketChanged = (event) => {
    setSelectedMarket(event);
    if (event !== 'ALTS') {
      setAltsCategory('ALL');
    }
  }

  const onAltsCategoryChanged = (event) => {
    setAltsCategory(event.target.value);
  }

  const onColumnChange = (event) => {
    setShowColumn(event.target.value);
  }

  return (
    <Flex flexDirection="row" alignItems="center">
      <RadioButtonGroup
        value={selectedMarket}
        onChange={onMarketChanged}
        isInline
        mr="12px"
      >
        <CustomRadio value="FAVOURITE"><Icon name="star" size="12px" /></CustomRadio>
        <CustomRadio value="BNB">BNB</CustomRadio>
        <CustomRadio value="BTC">BTC</CustomRadio>
        <CustomRadio value="ALTS">ALTS
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
        <CustomRadio value="USDⓈ">USDⓈ
          <CustomSelect
            isDisabled={selectedMarket !== 'USDⓈ'}
            onChange={onAltsCategoryChanged}
            value={altsCategory}
          >
            {
              usdCategoryValues.map(el =>
                <option key={`key-usd-category-${el}`} value={el}>{el}</option>
              )
            }
          </CustomSelect>
        </CustomRadio>
      </RadioButtonGroup>
      <RadioGroup
        value={showColumn}
        onChange={onColumnChange}
        isInline
        mr="12px"
      >
        <Radio variantColor="orange" value="1">Change</Radio>
        <Radio variantColor="orange" value="2">Volume</Radio>
      </RadioGroup>
    </Flex>
  );
}

export default Header;