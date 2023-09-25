module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/utils/**/*.{js,ts,jsx,tsx}',
    './src/configs/**/*.{js,ts,jsx,tsx}'
  ],
  content: [],
  theme: {
    fontFamily: {
      work: ['"Work Sans"', 'sans-serif']
    },
    colors: {
      primary: '#F5773A',
      secondary: '#9ECBE5',
      secondaryDark: '#04324D',

      // bar backgrounds
      bar1: '#27729D',
      bar2: '#FFB82B',
      bar3: '#904498',
      bar4: '#48ABA5',
      bar5: '#0C3190',
      bar6: '#62B230',
      bar7: '#BE3737',

      mainGreyColor: '#EEE',
      mainBorderColor: '#D9D9D9',
      secondaryBorderColor: '#BFBFBF',
      tertiaryBorderColor: '#EEEEEE',
      antdBorderColor: '#f0f0f0',

      secColor: '#f4f4f4',

      darkText: '#2f404a',
      darkBlueText: '#0C4A6E',
      mainText: '#3B505C',
      lightText: '#76858d',

      containerColor: '#F7F8FA',
      primaryLight: '#fef1eb',
      link: '#F07C28',

      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
      info: '#1890ff',
      muted: '#989898',
      error: '#FFA1A3',

      successStatus: '#E1FFD2',
      warningStatus: '#FFF1D4',
      dangerStatus: '#FFD4D5',
      infoStatus: '#D2EDFF',

      mutedStatus: 'rgba(0,0,0,0.25)',

      successStatusText: '#006E03',
      warningStatusText: '#8C5D00',
      dangerStatusText: '#A90808',
      infoStatusText: '#085A90',

      white: '#FFFFFF',
      black: '#000000',
      transparent: 'rgba(0,0,0,0)'
    },
    minHeight: {
      8: '2rem',
      12: '3rem',
      15: '60px',
      16: '4rem'
    },
    minWidth: {
      20: '80px'
    },
    extend: {
      height: {
        list: '300px',
        select: '234px',
        grid: '38.3rem'
      },
      gridTemplateRows: {
        commentSectionRows: '80px 1fr 60px'
      },
      gridTemplateColumns: {
        commentSectionCols: '100%'
      },
      borderStyle: ['hover']
    }
  },
  safelist: [
    'bg-bar1',
    'bg-bar2',
    'bg-bar3',
    'bg-bar4',
    'bg-bar5',
    'bg-bar6',
    'bg-bar7',
    'bg-dangerStatus',
    'bg-opacity-70',
    'outline-error',
    'outline-*',
    'disabled:*',
    'enabled:*'
  ],
  plugins: []
};
