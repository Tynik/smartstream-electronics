import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  transform: {
    '\\.ts$': ['babel-jest', {
      configFile: `./jest.babel.config.js`
    }]
  }
};

export default config;
