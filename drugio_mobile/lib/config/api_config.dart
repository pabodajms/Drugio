import 'dart:io';

class ApiConfig {
  static String get baseUrl {
    if (Platform.isAndroid) {
      // Real devices use machine's LAN IP
      return "http://192.168.8.144:3030";
    } else if (Platform.isIOS) {
      // iOS Simulator can use localhost directly
      return "http://localhost:3030";
    } else {
      // Android Emulator uses 10.0.2.2 to access host machine
      return "http://10.0.2.2:3030";
    }
  }
}
