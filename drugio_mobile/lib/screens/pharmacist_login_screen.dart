import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:drugio_mobile/screens/home_screen.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:drugio_mobile/services/auth_service.dart';

class PharmacistLoginScreen extends StatefulWidget {
  const PharmacistLoginScreen({super.key});

  @override
  State<PharmacistLoginScreen> createState() => _PharmacistLoginScreenState();
}

class _PharmacistLoginScreenState extends State<PharmacistLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String password = '';

  void handleLogin() async {
    if (_formKey.currentState!.validate()) {
      try {
        UserCredential user = await FirebaseAuth.instance
            .signInWithEmailAndPassword(email: email, password: password);

        String? fcmToken = await FirebaseMessaging.instance.getToken();

        // Update token only
        await AuthService.updatePharmacistToken(user.user!.uid, fcmToken!);

        // Fetch and cache pharmacist ID
        await AuthService.fetchAndStorePharmacistId(user.user!.uid);

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } catch (e) {
        print("Login error: $e");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Login failed. Check your credentials."),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Pharmacist Login")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: "Email"),
                onChanged: (val) => email = val,
                validator: (val) => val!.isEmpty ? "Enter email" : null,
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: "Password"),
                obscureText: true,
                onChanged: (val) => password = val,
                validator: (val) => val!.length < 6 ? "Min 6 characters" : null,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: handleLogin,
                child: const Text("Login"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
