import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static Future<void> registerAnonymousUser(String uid, String fcmToken) async {
    await http.post(
      Uri.parse("http://192.168.8.144:3030/api/users/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"firebase_uid": uid, "fcm_token": fcmToken}),
    );
  }

  static Future<void> registerPharmacist(
    Map<String, dynamic> pharmacist,
  ) async {
    final response = await http.post(
      Uri.parse("http://192.168.8.144:3030/api/pharmacists/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(pharmacist),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final pharmacistId = data['pharmacistId'] ?? data['pharmacist']?['id'];

      if (pharmacistId != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('pharmacist_Id', pharmacistId);
        print("Pharmacist ID stored: $pharmacistId");
      } else {
        print("Pharmacist ID not found in response.");
      }
    } else if (response.statusCode == 409) {
      // Already registered → fetch pharmacist details
      final existing = jsonDecode(response.body);
      final pharmacistId = existing['pharmacist']['id'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('pharmacist_Id', pharmacistId);
      print("Pharmacist already exists. ID stored: $pharmacistId");
    } else {
      throw Exception('Failed to register pharmacist. ${response.body}');
    }
  }

  static Future<void> updatePharmacistToken(
    String firebaseUid,
    String fcmToken,
  ) async {
    await http.post(
      Uri.parse("http://192.168.8.144:3030/api/pharmacists/update-token"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"firebase_uid": firebaseUid, "fcm_token": fcmToken}),
    );
  }

  static Future<void> fetchAndStorePharmacistId(String firebaseUid) async {
    final response = await http.post(
      Uri.parse(
        "http://192.168.8.144:3030/api/pharmacists/get-by-firebase-uid",
      ),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"firebase_uid": firebaseUid}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      final pharmacist = data['pharmacist'];
      if (pharmacist != null && pharmacist['id'] != null) {
        final pharmacistId = pharmacist['id'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('pharmacist_Id', pharmacistId);
        print("Pharmacist ID cached: $pharmacistId");
      } else {
        print("Pharmacist or ID is null");
      }
    } else {
      print("Failed to fetch pharmacist ID. Status: ${response.statusCode}");
    }
  }
}
