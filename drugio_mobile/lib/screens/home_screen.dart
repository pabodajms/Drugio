import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../widgets/search_box.dart';
import '../widgets/home_buttons.dart';
import '../screens/notification_list_screen.dart';
import '../screens/user_notifications_screen.dart';
import '../services/prescription_service.dart';
import '../widgets/footer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PrescriptionService _prescriptionService = PrescriptionService();
  int _notificationCount = 0;
  String? _userRole;

  @override
  void initState() {
    super.initState();
    _initUserRole();
  }

  Future<void> _initUserRole() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    try {
      final role = await _prescriptionService.getUserRole(user.uid);

      setState(() {
        _userRole = role;
      });

      if (role == 'pharmacist') {
        _fetchPrescriptionCount();
      } else {
        _notificationCount = 0;
      }
    } catch (e) {
      debugPrint("Failed to fetch user role: $e");
      setState(() {
        _userRole = "unknown";
      });
    }
  }

  Future<void> _fetchPrescriptionCount() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      // fetch pharmacist details using firebase_uid
      final pharmacist = await _prescriptionService.getPharmacistByFirebaseUid(
        user.uid,
      );
      final pharmacistId = pharmacist['pharmacist_Id'];

      // fetch only unresponded prescriptions
      final prescriptions = await _prescriptionService
          .getUnrespondedPrescriptions(pharmacistId.toString());

      setState(() {
        _notificationCount = prescriptions.length;
      });
    } catch (e) {
      debugPrint('Error fetching prescriptions: $e');
    }
  }

  void _onNotificationPressed() {
    if (_userRole == 'pharmacist') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const NotificationListScreen()),
      );
    } else if (_userRole == 'user') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const UserNotificationsScreen()),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Unknown user role")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Drugio"),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications),
                onPressed: _onNotificationPressed,
              ),
              if (_notificationCount > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: CircleAvatar(
                    radius: 8,
                    backgroundColor: Colors.red,
                    child: Text(
                      '$_notificationCount',
                      style: const TextStyle(fontSize: 12, color: Colors.white),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: const [SearchBox(), SizedBox(height: 20), HomeButtons()],
        ),
      ),
      bottomNavigationBar: const Footer(),
    );
  }
}
