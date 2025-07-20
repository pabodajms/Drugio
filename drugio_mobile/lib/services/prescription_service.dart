import 'dart:convert';
import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:http/http.dart' as http;

class PrescriptionService {
  final String backendBaseUrl = "http://192.168.8.144:3030";

  Future<String> uploadImageToFirebase(File imageFile) async {
    final fileName = DateTime.now().millisecondsSinceEpoch.toString();
    final storageRef = FirebaseStorage.instance.ref().child(
      "prescriptions/$fileName",
    );

    final uploadTask = await storageRef.putFile(imageFile);
    final downloadUrl = await uploadTask.ref.getDownloadURL();
    return downloadUrl;
  }

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
}
