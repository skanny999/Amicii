module.exports = {
    cacheDirectory: "./cache",
    collectCoverage: true,
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: ["detox"],
    preset: "react-native",
    testMatch: ["**/*.unit.tsx","**/*.unit.ts", "**/*.snapshot.tsx", "**/*.rntl.tsx"],
    transformIgnorePatterns: [
      "node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)",
    ],
  };