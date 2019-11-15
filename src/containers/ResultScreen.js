import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {Result} from '../components/Result';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet, View} from 'react-native';
import {createAction} from '../actions';
import {WALLPAPER_LOAD_REQUEST} from '../actionTypes/wallpaper';

const {width: viewportWidth} = Dimensions.get('window');

const sliderWidth = Math.round(viewportWidth * 1);
const itemHorizontalMargin = Math.round(viewportWidth * 0);
const itemWidth = sliderWidth + itemHorizontalMargin * 2;

function ResultScreen({results, wallpaper}) {
  function renderItem({item}) {
    const wallp = wallpaper[item.key];
    const backgroundImageUrl = wallp && wallp.urls.regular;
    return (
      <Result
        key={item.key}
        params={item.params}
        grossAnnualIncome={item.grossAnnualIncome}
        deductions={item.deductions}
        backgroundImageUrl={backgroundImageUrl}
      />
    );
  }
  const [activeSliderNum, setActiveSliderNum] = useState(1);
  const [carousel, setCarousel] = useState(null);
  const dispatch = useDispatch();

  if (results.length > 0) {
    dispatch(createAction(WALLPAPER_LOAD_REQUEST, results[0].key));
    return (
      <View style={styles.container}>
        <Carousel
          ref={setCarousel}
          data={results}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={setActiveSliderNum}
        />
      </View>
    );
  }
}

ResultScreen.navigationOptions = {
  title: 'Results',
};

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
  wallpaper: state.wallpaper,
});

export default connect(mapStateToProps)(ResultScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  paginationContainer: {
    paddingTop: 10,
  },
  paginationDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginHorizontal: 8,
  },
});
