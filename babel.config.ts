module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': 'app/(auth)', // Corrected to point to the `app` folder
        },
      },
    ],
  ],
};
