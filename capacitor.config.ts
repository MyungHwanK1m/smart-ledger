import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartledger.app',
  appName: '스마트 가계부',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
