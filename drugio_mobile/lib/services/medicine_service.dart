import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:drugio_mobile/config/api_config.dart';

class MedicineService {
  static final String baseUrl = "${ApiConfig.baseUrl}/api/medicines";

  static Future<List<dynamic>> searchMedicines(
    String query,
    String filter,
  ) async {
    final url = Uri.parse("$baseUrl/search?query=$query&filter=$filter");

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data; // should be a list of medicines
    } else {
      throw Exception("Failed to load medicines");
    }
  }

  static Future<List<dynamic>> getBrandsByGeneric(String genericName) async {
    final url = Uri.parse("$baseUrl/brands/$genericName");

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data;
    } else {
      throw Exception("Failed to load brands for generic $genericName");
    }
  }

  static Future<Map<String, dynamic>> getMedicineById(int medicine_Id) async {
    final url = Uri.parse("$baseUrl/$medicine_Id");
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data;
    } else {
      throw Exception("Failed to load medicine details");
    }
  }

  static Future<Map<String, dynamic>> getMedicineByBrandId(int brandId) async {
    final url = Uri.parse("$baseUrl/brand/$brandId");
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data;
    } else {
      throw Exception("Failed to load medicine details for brand");
    }
  }
}
