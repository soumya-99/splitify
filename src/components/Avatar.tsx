import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getInitials } from '@/src/utils/avatar';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 32, md: 40, lg: 56 };
const FONT_SIZES = { sm: 12, md: 14, lg: 20 };

const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md' }) => {
  const dim = SIZES[size];
  const fontSize = FONT_SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: color,
        },
      ]}
      accessibilityLabel={`Avatar for ${name}`}
    >
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default Avatar;
