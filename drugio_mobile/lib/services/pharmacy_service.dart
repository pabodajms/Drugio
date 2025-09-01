import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:drugio_mobile/config/api_config.dart';

class PharmacyService {
  static final String baseUrl = "${ApiConfig.baseUrl}/api/pharmacies";

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
