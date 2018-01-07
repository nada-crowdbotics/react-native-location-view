import React from 'react';
import {
  FlatList, Text, View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform,
  TouchableNativeFeedback
} from "react-native";
import Events from "react-native-simple-events";
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 5
  },
  list: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    maxHeight: 220,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  primaryText: {
    color: '#545961',
    fontSize: 14
  },
  secondaryText: {
    color: '#A1A1A9',
    fontSize: 13
  }
});

export default class AutoCompleteListView extends React.Component {
  static propTypes = {
    predictions: PropTypes.array.isRequired,
    onSelectPlace: PropTypes.func
  };

  state = {
    inFocus: false
  };

  constructor() {
    super();
    this._onTextFocus = this._onTextFocus.bind(this);
    this._onTextBlur = this._onTextBlur.bind(this);
  }

  componentDidMount() {
    Events.listen('InputBlur', this.constructor.displayName, this._onTextBlur);
    Events.listen('InputFocus', this.constructor.displayName, this._onTextFocus);
  }

  componentWillUnmount() {
    Events.rm('InputBlur', this.constructor.displayName);
    Events.rm('InputFocus', this.constructor.displayName);
  }

  _onTextFocus() {
    this.setState({inFocus: true});
  }

  _onTextBlur() {
    this.setState({inFocus: false});
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  _renderItem({item}) {
    const TouchableControl = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
    const {structured_formatting} = item;
    return (
      <TouchableControl onPress={() => Events.trigger('PlaceSelected', item.place_id)}>
        <View style={styles.row}>
          <Text
            style={styles.primaryText}
            numberOfLines={1}
          >
            {structured_formatting.main_text}
          </Text>
          <Text
            style={styles.secondaryText}
            numberOfLines={1}
          >
            {structured_formatting.secondary_text}
          </Text>
        </View>
      </TouchableControl>
    )
  }

  render() {
    const style = this.state.inFocus ? null : {height: 0};
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        elevation={3}
        style={[styles.list, style]}
        data={this.props.predictions}
        renderItem={this._renderItem.bind(this)}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={item => item.id}
      />
    )
  }
}