import React from 'react';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';

export const WaterOutline = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 4C14 4 7 14.5 7 20C7 23.3137 10.134 26 14 26C17.866 26 21 23.3137 21 20C21 14.5 14 4 14 4Z"
      stroke="#B0B0B0"
      strokeWidth={2}
      fill="none"
      strokeLinejoin="round"
    />
  </Svg>
);

export const WaterFilled = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Defs>
      <LinearGradient
        id="waterFillGradient"
        x1="14"
        y1="4"
        x2="14"
        y2="26"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#4A90E2" />
        <Stop offset="1" stopColor="#1976D2" />
      </LinearGradient>
    </Defs>
    <Path
      d="M14 4C14 4 7 14.5 7 20C7 23.3137 10.134 26 14 26C17.866 26 21 23.3137 21 20C21 14.5 14 4 14 4Z"
      fill="url(#waterFillGradient)"
      stroke="#4A90E2"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle cx="14" cy="19" r="3" fill="#fff" fillOpacity={0.13} />
  </Svg>
);

export const FatBurnOutline = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="#B0B0B0">
    <Path
      d="M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9zM713 808.5c-53.7 53.2-125 82.4-201 82.4s-147.3-29.2-201-82.4c-53.5-53.1-83-123.5-83-198.4 0-43.5 9.8-85.2 29.1-124 18.8-37.9 46.8-71.8 80.8-97.9a349.6 349.6 0 0 0 58.6-56.8c25-30.5 44.6-64.5 58.2-101a240 240 0 0 0 12.1-46.5c24.1 22.2 44.3 49 61.2 80.4 33.4 62.6 48.8 118.3 45.8 165.7a74.01 74.01 0 0 0 24.4 59.8 73.36 73.36 0 0 0 53.4 18.8c19.7-1 37.8-9.7 51-24.4 13.3-14.9 24.8-30.1 34.4-45.6 14 17.9 25.7 37.4 35 58.4 15.9 35.8 24 73.9 24 113.1 0 74.9-29.5 145.4-83 198.4z"
      stroke="#B0B0B0"
      strokeWidth={2}
      fill="#B0B0B0"
    />
  </Svg>
);

export const FatBurnFilled = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
    <Defs>
      <LinearGradient
        id="flameGradient"
        x1="512"
        y1="0"
        x2="512"
        y2="1024"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="80%" stopColor="#ff460f" />
        <Stop offset="20%" stopColor="#ffe52c" />
      </LinearGradient>
    </Defs>
    <Path
      d="M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9z"
      fill="url(#flameGradient)"
      stroke="#FF9800"
      strokeWidth={2}
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </Svg>
);
export const FlagOutline = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path d="M7 5V23" stroke="#B0B0B0" strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M7 6C14 6 24 4 23 7V18C18 16 10 16 7 18V10Z"
      stroke="#B0B0B0"
      strokeWidth={2}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

export const FlagFilled = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path d="M7 5V23" stroke="#B0B0B0" strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M7 6C14 6 24 4 23 7V18C18 16 10 16 7 18V10Z"
      stroke="#B0B0B0"
      strokeWidth={2}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />

    <>
      {/* Satır 1 */}
      <Rect x="7" y="6" width="2" height="2" fill="black" />
      <Rect x="11" y="6" width="2" height="2" fill="black" />
      <Rect x="15" y="6" width="2" height="2" fill="black" />
      <Rect x="19" y="6" width="2" height="2" fill="black" />

      {/* Satır 2 */}
      <Rect x="9" y="8" width="2" height="2" fill="black" />
      <Rect x="13" y="8" width="2" height="2" fill="black" />
      <Rect x="17" y="8" width="2" height="2" fill="black" />
      <Rect x="21" y="8" width="2" height="2" fill="black" />

      {/* Satır 3 */}
      <Rect x="7" y="10" width="2" height="2" fill="black" />
      <Rect x="11" y="10" width="2" height="2" fill="black" />
      <Rect x="15" y="10" width="2" height="2" fill="black" />
      <Rect x="19" y="10" width="2" height="2" fill="black" />

      {/* Satır 4 */}
      <Rect x="9" y="12" width="2" height="2" fill="black" />
      <Rect x="13" y="12" width="2" height="2" fill="black" />
      <Rect x="17" y="12" width="2" height="2" fill="black" />
      <Rect x="21" y="12" width="2" height="2" fill="black" />

      {/* Satır 5 */}
      <Rect x="7" y="14" width="2" height="2" fill="black" />
      <Rect x="11" y="14" width="2" height="2" fill="black" />
      <Rect x="15" y="14" width="2" height="2" fill="black" />
      <Rect x="19" y="14" width="2" height="2" fill="black" />
    </>
  </Svg>
);
