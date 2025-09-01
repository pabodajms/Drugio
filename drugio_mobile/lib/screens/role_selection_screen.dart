import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:drugio_mobile/screens/home_screen.dart';
import 'package:drugio_mobile/screens/pharmacist_register_screen.dart';
import 'package:drugio_mobile/services/auth_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  void handleAnonymousLogin(BuildContext context) async {
    try {
      final userCredential = await FirebaseAuth.instance.signInAnonymously();
      final user = userCredential.user;

      if (user != null) {
        // Get the actual FCM token
        final fcmToken = await FirebaseMessaging.instance.getToken();

        if (fcmToken != null) {
          await AuthService.registerAnonymousUser(user.uid, fcmToken);

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const HomeScreen()),
          );
        } else {
          throw Exception("Failed to get FCM token");
        }
      }
    } catch (e) {
      print("Anonymous login error: $e");

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Failed to continue as general user."),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void handlePharmacistNavigation(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const PharmacistRegisterScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Choose Role")),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: () => handleAnonymousLogin(context),
                icon: const Icon(Icons.person_outline),
                label: const Text("Continue as General User"),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () => handlePharmacistNavigation(context),
                icon: const Icon(Icons.medical_services),
                label: const Text("Continue as Pharmacist"),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
