import 'dart:convert';
import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:http/http.dart' as http;

class PrescriptionService {
  final String backendBaseUrl = "http://192.168.8.144:3030";

  // Uploads the image to Firebase Storage and returns the download URL
  Future<String> uploadImageToFirebase(File imageFile) async {
    final fileName = DateTime.now().millisecondsSinceEpoch.toString();
    final storageRef = FirebaseStorage.instance.ref().child(
      "prescriptions/$fileName",
    );

    final uploadTask = await storageRef.putFile(imageFile);
    final downloadUrl = await uploadTask.ref.getDownloadURL();
    return downloadUrl;
  }

  // Sends prescription metadata to the backend
  Future<bool> sendPrescriptionToBackend({
    required String imageUrl,
    required String? userId,
    String? comment,
  }) async {
    final url = Uri.parse('$backendBaseUrl/api/prescriptions/upload');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'user_Id': userId,
        'image_url': imageUrl,
        'comment': comment ?? '',
      }),
    );

    print("Backend response: ${response.statusCode} - ${response.body}");

    return response.statusCode == 200 || response.statusCode == 201;
  }

  // Fetches all uploaded prescriptions from backend
  Future<List<dynamic>> getPrescriptions() async {
    final response = await http.get(
      Uri.parse('$backendBaseUrl/api/prescriptions'),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load prescriptions');
    }
  }

  // Sends a pharmacist's response to a specific prescription
  Future<bool> submitPharmacistResponse({
    required int prescriptionId,
    required int pharmacistId,
    required String suggestedMedicines,
    required String directions,
    required String pharmacistComment,
  }) async {
    final url = Uri.parse('$backendBaseUrl/api/prescriptions/respond');

    final body = jsonEncode({
      'prescription_Id': prescriptionId,
      'pharmacist_Id': pharmacistId,
      'suggested_medicines': suggestedMedicines,
      'directions': directions,
      'pharmacist_comment': pharmacistComment,
    });

    print("Sending POST to $url with body: $body");

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: body,
    );

    print("Backend status: ${response.statusCode}");
    print("Backend response body: ${response.body}");

    return response.statusCode == 201 || response.statusCode == 200;
  }
}
