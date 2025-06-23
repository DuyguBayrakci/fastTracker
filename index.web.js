import { AppRegistry } from 'react-native';
import App from './App';

// Web için root element hazırla
const rootTag =
  document.getElementById('root') ||
  (() => {
    const div = document.createElement('div');
    div.id = 'root';
    div.style.height = '100vh';
    div.style.width = '100vw';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.appendChild(div);
    return div;
  })();

// React Native uygulamasını register et ve başlat
AppRegistry.registerComponent('FastTracker', () => App);
AppRegistry.runApplication('FastTracker', { rootTag });
