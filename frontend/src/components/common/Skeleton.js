import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

const ProfileSkeleton = () => {
  // Animation value for the shimmer effect
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create looping animation for the shimmer effect
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    };

    startShimmerAnimation();
    return () => shimmerAnimation.stopAnimation();
  }, []);

  // Interpolate the animation value to create the shimmer gradient
  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  // Skeleton item with shimmer effect
  const SkeletonItem = ({ style }) => {
    return (
      <View style={[styles.skeletonBase, style]}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Avatar skeleton */}
      <View style={styles.profileHeader}>
        <SkeletonItem style={styles.avatarSkeleton} />
        <SkeletonItem style={styles.nameSkeleton} />
        <SkeletonItem style={styles.roleSkeleton} />
      </View>

      {/* Info section skeletons */}
      <View style={styles.infoSection}>
        <SkeletonItem style={styles.labelSkeleton} />
        <SkeletonItem style={styles.valueSkeleton} />
        
        <SkeletonItem style={styles.labelSkeleton} />
        <SkeletonItem style={styles.addressSkeleton} />
        <SkeletonItem style={styles.addressSkeleton} />
        
        <SkeletonItem style={styles.labelSkeleton} />
        <SkeletonItem style={styles.valueSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  skeletonBase: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    width: 100,
    height: '100%',
    backgroundColor: '#F2F8FC',
    opacity: 0.5,
    position: 'absolute',
  },
  avatarSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  nameSkeleton: {
    width: 200,
    height: 22,
    marginBottom: 10,
  },
  roleSkeleton: {
    width: 120,
    height: 16,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  labelSkeleton: {
    width: 100,
    height: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  valueSkeleton: {
    width: '90%',
    height: 16,
  },
  addressSkeleton: {
    width: '90%',
    height: 16,
    marginBottom: 5,
  },
});

export default ProfileSkeleton;