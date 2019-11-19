import React from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import Result from '../components/Result';
import Carousel from 'react-native-snap-carousel';
import {Dimensions, StyleSheet, View, Text, ScrollView} from 'react-native';
import {createAction} from '../actions';
import {CALCULATION_DELETE_REQUEST} from '../actionTypes/calculation';
import Icon from 'react-native-vector-icons/dist/Feather';

const {width: viewportWidth} = Dimensions.get('window');

const sliderWidth = Math.round(viewportWidth * 1);
const itemHorizontalMargin = Math.round(viewportWidth * 0);
const itemWidth = sliderWidth + itemHorizontalMargin * 2;

function ResultScreen({results}) {
  function renderItem({item, index}) {
    return <Result {...item} onDelete={() => onDelete(index)} />;
  }

  function onDelete(index) {
    dispatch(createAction(CALCULATION_DELETE_REQUEST, index));
  }

  const dispatch = useDispatch();

  if (results.length > 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}>
        <Carousel
          data={results}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          initialNumToRender={1}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>No results to display</Text>
    </View>
  );
}

ResultScreen.navigationOptions = ({navigation}) => ({
  title: 'Results',
  tabBarIcon: <Icon name="file-text" size={28} color="#ddd" />,
  tabBarColor: '#009688',
  shifting: true,
  tabBarBadge: navigation.state.params && navigation.state.params.badge,
});

ResultScreen.propType = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      gross: PropTypes.number.isRequired,
      studentLoan: PropTypes.number,
      taxes: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
        }),
      ),
    }),
  ),
};

const mapStateToProps = state => ({
  results: state.calculation,
});

export default connect(mapStateToProps)(ResultScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {flexGrow: 1},
  headline: {
    textAlign: 'center',
  },
});
