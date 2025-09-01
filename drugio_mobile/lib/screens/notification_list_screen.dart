import 'package:flutter/material.dart';
import '../services/prescription_service.dart';
import 'prescription_detail_screen.dart';
import '../widgets/footer.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationListScreen extends StatefulWidget {
  const NotificationListScreen({super.key});

  @override
  State<NotificationListScreen> createState() => _NotificationListScreenState();
}

class _NotificationListScreenState extends State<NotificationListScreen> {
  List<dynamic> _prescriptions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPrescriptions();
  }

  Future<void> _loadPrescriptions() async {
    try {
      // fetch pharmacistId from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final pharmacistId = prefs.getInt('pharmacist_Id');
      if (pharmacistId == null) {
        throw Exception("Pharmacist ID not found in storage");
      }

      final prescriptions = await PrescriptionService()
          .getPrescriptionsForPharmacist(pharmacistId.toString());

      setState(() {
        _prescriptions = prescriptions;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load prescriptions: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Prescription Notifications")),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _prescriptions.isEmpty
          ? const Center(child: Text("No prescriptions found."))
          : ListView.builder(
              itemCount: _prescriptions.length,
              itemBuilder: (context, index) {
                final p = _prescriptions[index];
                return Card(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  child: ListTile(
                    leading: Icon(
                      p['has_responded'] == 1
                          ? Icons.check_circle
                          : Icons.pending_actions,
                      color: p['has_responded'] == 1
                          ? Colors.green
                          : Colors.orange,
                    ),
                    title: Text("Prescription ${p['prescription_Id']}"),
                    subtitle: Text(
                      p['comment']?.toString() ?? "No comment provided",
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              PrescriptionDetailScreen(prescription: p),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
      bottomNavigationBar: const Footer(),
    );
  }
}
