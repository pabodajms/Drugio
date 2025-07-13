import 'package:http/http.dart' as http;
import 'dart:convert';

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
    await http.post(
      Uri.parse("http://192.168.8.144:3030/api/pharmacists/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(pharmacist),
    );
  }
}
