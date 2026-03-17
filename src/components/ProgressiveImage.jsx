import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

const ProgressiveImage = ({ source, style }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[style, styles.container]}>
      {loading && (
        <View style={styles.placeholder}>
          <ActivityIndicator color="#175560" size="small" />
        </View>
      )}
      <Image source={source} style={[style, loading && styles.hidden]} onLoadEnd={() => setLoading(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e8ecec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
});

export default ProgressiveImage;
