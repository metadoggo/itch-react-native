import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {Result} from '../components/Result';
import Carousel from 'react-native-snap-carousel';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {createAction} from '../actions';
import {WALLPAPER_LOAD_REQUEST} from '../actionTypes/wallpaper';
import {CALCULATION_DELETE_REQUEST} from '../actionTypes/calculation';
import Icon from 'react-native-vector-icons/dist/Feather';

const {width: viewportWidth} = Dimensions.get('window');

const sliderWidth = Math.round(viewportWidth * 1);
const itemHorizontalMargin = Math.round(viewportWidth * 0);
const itemWidth = sliderWidth + itemHorizontalMargin * 2;

function ResultScreen({results, wallpaper, navigation}) {
  function renderItem({item, index}) {
    const wallp = wallpaper[item.key];
    const backgroundImageUrl = wallp && wallp.urls.regular;
    return (
      <Result
        {...item}
        backgroundImageUrl={backgroundImageUrl}
        onDelete={() => onDelete(index)}
      />
    );
  }

  function onDelete(index) {
    dispatch(createAction(CALCULATION_DELETE_REQUEST, index));
  }

  const [badge, setBadge] = useState(0);
  if (badge !== results.length) {
    setBadge(results.length);
    navigation.setParams({badge: results.length});
  }

  const dispatch = useDispatch();

  if (results.length > 0) {
    dispatch(createAction(WALLPAPER_LOAD_REQUEST, results[0].key));
    return (
      <View style={styles.container}>
        <Carousel
          data={results}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
        />
      </View>
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
  wallpaper: state.wallpaper,
});

export default connect(mapStateToProps)(ResultScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  headline: {
    textAlign: 'center',
  },
});
