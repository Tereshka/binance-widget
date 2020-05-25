import React from 'react';
import {
  SimpleGrid,
  Stack,
  Flex,
  IconButton,
  Text,
  Divider,
} from "@chakra-ui/core";

const CustomIconButton = React.forwardRef((props, ref) => {
  const { value, ...rest } = props;
  return (
    <IconButton
      ref={ref}
      ml="1"
      aria-label={value}
      icon={`triangle-${value === 'asc' ? 'up' : 'down'}`}
      variant="ghost"
      size="sm"
      variantColor="orange"
      isRound
      cursor='pointer'
      {...rest}
    />
  );
});

function Content(props) {
  const { data, showColumn, orderBy, setOrderBy, orderDirection, setOrderDirection } = props;

  const handleChangeOrderBy = (value) => {
    if (value !== orderBy) {
      setOrderBy(value);
      setOrderDirection('asc');
    } else {
      handleChangeOrderDirection();
    }
  }

  const handleChangeOrderDirection = () => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  }

  const renderLines = () => {
    return data.map((el, i) => {
      const changeValue = (+el.o - +el.c).toFixed(8);
      return (
      <React.Fragment key={`key-row-${i}`}>
        {i !== 0 && <Divider width="100%"  key={`key-divider-${i}`} borderColor="orange.200"/>}
        <SimpleGrid key={`key-data-${i}`} columns={3} spacing={5} textAlign="center">
          <Text my="1">{el.b}/{el.q}</Text>
          <Text my="1">{el.c}</Text>
          {showColumn === "1" &&
            <Text my="1"
              color={changeValue >= 0 ? "green.400" : "red.400"}
            >
              {changeValue}
            </Text>
          }
          {showColumn === "2" && <Text my="1">{(+el.qv).toFixed(0)}</Text>}
        </SimpleGrid>
      </React.Fragment>
    )});
  }

  return (
    <Stack mt='5'>
      <SimpleGrid columns={3} spacing={5} bg="orange.100">
        <Flex flexDirection="row" alignItems="center" justifyContent="center" my="1" >
          <Text cursor='pointer' onClick={() => handleChangeOrderBy('name')}>Pair</Text>
          {orderBy === 'name' && <CustomIconButton value={orderDirection} onClick={handleChangeOrderDirection}/>}
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="center" my="1" >
          <Text cursor='pointer' onClick={() => handleChangeOrderBy('price')}>Last Price</Text>
          {orderBy === 'price' && <CustomIconButton value={orderDirection} onClick={handleChangeOrderDirection}/>}
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="center" my="1" >
          <Text cursor='pointer'
            onClick={() => handleChangeOrderBy(showColumn === "1" ? "change" : "volume")}
          >
            {showColumn === "1" ? "Change" : "Volume"}
          </Text>
          {['change', 'volume'].includes(orderBy) && <CustomIconButton value={orderDirection} onClick={handleChangeOrderDirection}/>}
        </Flex>
      </SimpleGrid>
      {renderLines()}
    </Stack>);
}

export default Content;