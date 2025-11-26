import { AppProvider, useApp } from '../context/AppContext';
import { ConfigProvider, theme as antdTheme } from 'antd';
import '../pages/styles/globals.css';

function ThemedApp({ Component, pageProps }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default function App(props) {
  return (
    <AppProvider>
      <ThemedApp {...props} />
    </AppProvider>
  );
}