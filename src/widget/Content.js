import React, {useContext} from 'react';
import {AppContext} from '../App';
import {
  SET_ORDER_BY,
  SET_ORDER_DIRECTION,
  TOGGLE_FAVOURITE,
} from '../widgetActions';

import {
  SimpleGrid,
  Stack,
  Flex,
  IconButton,
  Text,
  Divider,
} from '@chakra-ui/core';

const CustomIconButton = React.forwardRef((props, ref) => {
  const { value, ...rest } = props;
  return (
    <IconButton
      ref={ref}
      ml='1'
      aria-label={value}
      icon={`triangle-${value === 'asc' ? 'up' : 'down'}`}
      variant='ghost'
      size='sm'
      border='none'
      variantColor='orange'
      isRound
      cursor='pointer'
      {...rest}
    />
  );
});

function Content() {
  const { state, dispatch } = useContext(AppContext);
  const {
    filteredData,
    favouriteList,
    showColumn,
    orderBy,
    orderDirection,
  } = state;

  const handleChangeOrderBy = (value) => {
    if (value !== orderBy) {
      dispatch({ type: SET_ORDER_BY, payload: value });
      dispatch({ type: SET_ORDER_DIRECTION, payload: 'asc' });
    } else {
      handleChangeOrderDirection();
    }
  }

  const handleChangeOrderDirection = () => {
    dispatch({ type: SET_ORDER_DIRECTION, payload: orderDirection === 'asc' ? 'desc' : 'asc' });
  }

  const handleAddToFavourite = (isFavourite, value) => {
    dispatch({ type: TOGGLE_FAVOURITE, payload: {isFavourite, value} });
  }

  const renderLines = () => {
    return filteredData.map((el, i) => {
      const changeValue = (+el.o - +el.c).toFixed(8);
      const isFavourite = favouriteList.find(fav => fav === el.s);
      return (
      <React.Fragment key={`key-row-${i}`}>
        {i !== 0 && <Divider width='100%'  key={`key-divider-${i}`} borderColor='orange.200'/>}
        <SimpleGrid key={`key-data-${i}`} columns={3} spacing={5} textAlign='center' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' my='1'>
          <IconButton
            ml='1'
            aria-label='fav'
            icon='star'
            variant='outline'
            size='sm'
            border='none'
            variantColor={isFavourite ? 'orange' : 'gray'}
            _hover={{ color: 'gray.700' }}
            isRound
            cursor='pointer'
            onClick={() => handleAddToFavourite(isFavourite, el.s)}
          />
            <Text>{el.b}/{el.q}</Text>
          </Flex>
          <Text my='1'>{el.c}</Text>
          {showColumn === '1' &&
            <Text my='1'
              color={changeValue >= 0 ? 'green.400' : 'red.400'}
            >
              {changeValue}
            </Text>
          }
          {showColumn === '2' && <Text my='1'>{(+el.qv).toFixed(0)}</Text>}
        </SimpleGrid>
      </React.Fragment>
    )});
  }

  return (
    <Stack mt='5'>
      <SimpleGrid columns={3} spacing={5} bg='orange.100'>
        <Flex flexDirection='row' alignItems='center' justifyContent='center' my='1' >
          <Text cursor='pointer' onClick={() => handleChangeOrderBy('name')}>Pair</Text>
          {orderBy === 'name' && <CustomIconButton value={orderDirection} onClick={handleChangeOrderDirection}/>}
        </Flex>
        <Flex flexDirection='row' alignItems='center' justifyContent='center' my='1' >
          <Text cursor='pointer' onClick={() => handleChangeOrderBy('price')}>Last Price</Text>
          {orderBy === 'price' && <CustomIconButton value={orderDirection} onClick={handleChangeOrderDirection}/>}
        </Flex>
        <Flex flexDirection='row' alignItems='center' justifyContent='center' my='1' >
          <Text cursor='pointer'
            onClick={() => handleChangeOrderBy(showColumn === '1' ? 'change' : 'volume')}
          >
            {showColumn === '1' ? 'Change' : 'Volume'}
          </Text>
          {['change', 'volume'].includes(orderBy) && <CustomIconButton value={orderDirection} onClick={handleChangeOrderDirection}/>}
        </Flex>
      </SimpleGrid>
      {renderLines()}
    </Stack>);
}

export default Content;