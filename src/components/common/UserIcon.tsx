import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const UserIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {/* Dış daire */}
    <Circle
      cx="14"
      cy="14"
      r="13"
      stroke="#e0e0e0"
      strokeWidth="2"
      fill="#f8f9fa"
    />
    {/* Kafa */}
    <Circle cx="14" cy="12" r="4" fill="#5f3dc4" />
    {/* Gövde */}
    <Path d="M8 21c0-3 8-3 8 0" fill="#5f3dc4" />
  </Svg>
);

export default UserIcon;
