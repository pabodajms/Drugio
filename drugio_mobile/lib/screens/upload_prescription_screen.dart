import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/prescription_service.dart';

class UploadPrescriptionScreen extends StatefulWidget {
  const UploadPrescriptionScreen({super.key});

  @override
  State<UploadPrescriptionScreen> createState() =>
      _UploadPrescriptionScreenState();
}

class _UploadPrescriptionScreenState extends State<UploadPrescriptionScreen> {
  File? _image;
  final _commentController = TextEditingController();
  final _picker = ImagePicker();
  bool _isLoading = false;

  final PrescriptionService _prescriptionService = PrescriptionService();

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _uploadPrescription() async {
    if (_image == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please select an image')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      final imageUrl = await _prescriptionService.uploadImageToFirebase(
        _image!,
      );
      final userId = user?.uid;
      final comment = _commentController.text;

      // Log request data before sending
      debugPrint('Sending to backend:');
      debugPrint('user_Id: $userId');
      debugPrint('image_url: $imageUrl');
      debugPrint('comment: $comment');

      final success = await _prescriptionService.sendPrescriptionToBackend(
        imageUrl: imageUrl,
        userId: userId,
        comment: comment,
      );

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Prescription uploaded successfully!')),
        );
        setState(() {
          _image = null;
          _commentController.clear();
        });
      } else {
        throw Exception('Failed to upload to backend');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Upload failed: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upload Prescription')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _image != null
                ? Image.file(_image!, height: 200)
                : Container(
                    height: 200,
                    width: double.infinity,
                    color: Colors.grey[300],
                    child: const Center(child: Text('No Image Selected')),
                  ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _pickImage,
              child: const Text('Pick Image'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _commentController,
              decoration: const InputDecoration(
                labelText: 'Comment (optional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 20),
            _isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton.icon(
                    onPressed: _uploadPrescription,
                    icon: const Icon(Icons.upload),
                    label: const Text('Upload'),
                  ),
          ],
        ),
      ),
    );
  }
}
