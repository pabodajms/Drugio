import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/prescription_service.dart';
import 'prescription_detail_screen.dart';
import 'prescription_responses_screen.dart';
import '../widgets/footer.dart';

class UserNotificationsScreen extends StatefulWidget {
  const UserNotificationsScreen({super.key});

  @override
  State<UserNotificationsScreen> createState() =>
      _UserNotificationsScreenState();
}

class _UserNotificationsScreenState extends State<UserNotificationsScreen> {
  final PrescriptionService _prescriptionService = PrescriptionService();
  List<dynamic> _userPrescriptions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserPrescriptions();
  }

  Future<void> _loadUserPrescriptions() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) throw Exception("User not logged in");

      final prescriptions = await _prescriptionService
          .getUserPrescriptionsWithResponses(user.uid);

      setState(() {
        _userPrescriptions = prescriptions;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load user prescriptions: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Your Prescription Responses")),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _userPrescriptions.isEmpty
          ? const Center(child: Text("No prescriptions uploaded yet."))
          : ListView.builder(
              itemCount: _userPrescriptions.length,
              itemBuilder: (context, index) {
                final prescription = _userPrescriptions[index];
                return Card(
                  margin: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  child: ListTile(
                    leading: const Icon(Icons.receipt_long),
                    title: Text(
                      "Prescription #${prescription['prescription_Id']}",
                    ),
                    subtitle: Text(
                      prescription['comment']?.toString() ??
                          "No comment provided",
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PrescriptionResponsesScreen(
                            prescription: prescription,
                          ),
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
