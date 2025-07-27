import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error Boundary caught an error:', error, errorInfo);

    // Burada crash reporting servisine gönderebilirsiniz
    // Örnek: Sentry, Crashlytics, vb.

    // EAS crash reporting için
    if (__DEV__) {
      console.log('Development mode - error logged to console');
    } else {
      // Production'da crash report gönder
      this.sendCrashReport(error, errorInfo);
    }
  }

  sendCrashReport = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // EAS crash reporting için basit implementasyon
      const crashData = {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        appVersion: '1.0.0',
        platform: 'android',
      };

      console.log('📊 Crash report data:', crashData);

      // Burada gerçek crash reporting servisine gönderebilirsiniz
      // fetch('your-crash-reporting-endpoint', {
      //   method: 'POST',
      //   body: JSON.stringify(crashData),
      // });
    } catch (reportError) {
      console.error('❌ Failed to send crash report:', reportError);
    }
  };

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>😔 Bir Hata Oluştu</Text>
          <Text style={styles.message}>
            Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen tekrar deneyin.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorText}>
              Hata: {this.state.error.message}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <Text style={styles.buttonText}>Yeniden Başlat</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;
