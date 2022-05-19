import { Linking } from 'react-native';
import log_message from './log';

export const linking = {
    prefixes: ['hichaty://'],
    async getInitialURL() {
      //log_message("App opened via a deep link", "Video or audio Call" );
      // Check if app was opened from a deep link
      const url = await Linking.getInitialURL();
      if (url != null) {
        return url;
      }
    }
};
  