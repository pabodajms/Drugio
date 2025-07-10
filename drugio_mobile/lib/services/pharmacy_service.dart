import 'dart:convert';
import 'package:http/http.dart' as http;

class PharmacyService {
  // static const String baseUrl =
  //     "http://10.0.2.2:3030/api/pharmacies"; // 10.0.2.2 for emulator
  // static const String baseUrl =
  //     "http://localhost:3030/api/pharmacies"; // Use this for local testing
  static const String baseUrl =
      "http://192.168.8.144:3030/api/pharmacies"; // replace with your PC’s real LAN IP when testing on a real phone

  static Future<List<dynamic>> getNearbyPharmacies(
    double lat,
    double lng,
  ) async {
    final response = await http.get(
      Uri.parse('$baseUrl/nearby?lat=$lat&lng=$lng&radius=100'),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load pharmacies');
    }
  }
}
