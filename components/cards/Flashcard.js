import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default class Flashcard extends Component {
  constructor() {
    super();
  }

  UNSAFE_componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });

    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
  }

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
    }
  }

  render() {
    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }],
    };
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }],
    };

    const {
      character,
      meaning,
      strokes,
      onyomi,
      kunyomi,
    } = this.props.kanji.kanji;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.flipCard()}>
          <Animated.View
            style={[
              styles.flipCard,
              frontAnimatedStyle,
              { backgroundColor: this.props.backgroundColor },
            ]}
          >
            <Text style={styles.label}>{character}</Text>
          </Animated.View>
          <Animated.View
            style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}
          >
            <Text style={styles.info}>Onyomi: {onyomi.katakana}</Text>
            <Text style={styles.info}>Kunyomi: {kunyomi.hiragana}</Text>
            <Text style={styles.info}> Strokes: {strokes.count}</Text>
            <Text style={styles.info}>Meaning: {meaning.english}</Text>
            <Text style={styles.info}>Examples:</Text>
            {this.props.kanji.examples.map(example => {
              return (
                <Text>
                  {example.japanese} - {example.meaning.english}
                </Text>
              );
            })}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    width: 300,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
  },
  flipCardBack: {
    backgroundColor: '#f8baff',
    position: 'absolute',
    top: 0,
  },
  card: {
    color: '#ffffff',
    height: 600,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  label: {
    color: '#ffffff',
    fontSize: 250,
    fontWeight: 'bold',
    backfaceVisibility: 'hidden',
  },
  info: {
    color: 'white',
    fontSize: 20,
  },
});
