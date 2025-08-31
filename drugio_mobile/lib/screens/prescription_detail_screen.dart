import 'package:flutter/material.dart';
import '../services/prescription_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/footer.dart';

class PrescriptionDetailScreen extends StatefulWidget {
  final Map prescription;

  const PrescriptionDetailScreen({super.key, required this.prescription});

  @override
  State<PrescriptionDetailScreen> createState() =>
      _PrescriptionDetailScreenState();
}

class _PrescriptionDetailScreenState extends State<PrescriptionDetailScreen> {
  final _medicineController = TextEditingController();
  final _directionsController = TextEditingController();
  final _commentController = TextEditingController();

  bool _submitting = false;

  Future<int?> _getPharmacistId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('pharmacist_Id'); // Make sure to store this after login
  }

  Future<void> _submitResponse() async {
    final pharmacistId = await _getPharmacistId();
    if (pharmacistId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Pharmacist ID not found')));
      return;
    }

    final prescriptionId = widget.prescription['prescription_Id'];
    final suggestedMedicines = _medicineController.text.trim();
    final directions = _directionsController.text.trim();
    final pharmacistComment = _commentController.text.trim();

    // 🔍 Print the values being submitted
    print("Submitting response with data:");
    print(" - Prescription ID: $prescriptionId");
    print(" - Pharmacist ID: $pharmacistId");
    print(" - Suggested Medicines: $suggestedMedicines");
    print(" - Directions: $directions");
    print(" - Pharmacist Comment: $pharmacistComment");

    setState(() => _submitting = true);

    try {
      final success = await PrescriptionService().submitPharmacistResponse(
        prescriptionId: prescriptionId,
        pharmacistId: pharmacistId,
        suggestedMedicines: suggestedMedicines,
        directions: directions,
        pharmacistComment: pharmacistComment,
      );

      setState(() => _submitting = false);

      if (success) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Response submitted')));
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Submission failed')));
      }
    } catch (e) {
      setState(() => _submitting = false);
      print("Exception in submit: $e");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final prescription = widget.prescription;

    return Scaffold(
      appBar: AppBar(title: const Text("Prescription Detail")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (prescription['image_url'] != null)
              Image.network(
                prescription['image_url'],
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child; // image loaded
                  return const Center(child: CircularProgressIndicator());
                },
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(
                    Icons.broken_image,
                    size: 100,
                    color: Colors.grey,
                  );
                },
              ),
            const SizedBox(height: 20),
            Text(
              "User Comment:",
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Text(prescription['comment'] ?? 'No comment provided'),
            const Divider(height: 30),
            TextField(
              controller: _medicineController,
              decoration: const InputDecoration(
                labelText: 'Suggested Medicines',
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _directionsController,
              decoration: const InputDecoration(labelText: 'Directions'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _commentController,
              decoration: const InputDecoration(labelText: 'Your Comment'),
            ),
            const SizedBox(height: 20),
            _submitting
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton.icon(
                    onPressed: _submitResponse,
                    icon: const Icon(Icons.send),
                    label: const Text("Submit Response"),
                  ),
          ],
        ),
      ),
      bottomNavigationBar: const Footer(),
    );
  }
}
