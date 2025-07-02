import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export const HomeIcon = ({ color = '#B0B0B0', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 12L14 4L24 12V23C24 23.5523 23.5523 24 23 24H5C4.44772 24 4 23.5523 4 23V12Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      fill="none"
    />
    <Rect
      x={10}
      y={16}
      width={8}
      height={6}
      rx={2}
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

export const PlansIcon = ({ color = '#B0B0B0', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Rect
      x={5}
      y={6}
      width={18}
      height={16}
      rx={3}
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Rect
      x={9}
      y={2}
      width={10}
      height={4}
      rx={2}
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M9 10H19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 14H19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M9 18H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export const StatisticsIcon = ({ color = '#B0B0B0', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Rect x={6} y={14} width={3} height={8} rx={1.5} fill={color} />
    <Rect x={12.5} y={10} width={3} height={12} rx={1.5} fill={color} />
    <Rect x={19} y={6} width={3} height={16} rx={1.5} fill={color} />
  </Svg>
);

export const ProfileIcon = ({ color = '#B0B0B0', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx={14} cy={10} r={5} stroke={color} strokeWidth={2} fill="none" />
    <Path
      d="M5 23C5 18.5817 9.02944 15 14 15C18.9706 15 23 18.5817 23 23"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);
