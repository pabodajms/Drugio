import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:drugio_mobile/screens/home_screen.dart';
import 'package:drugio_mobile/services/auth_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:drugio_mobile/screens/pharmacist_login_screen.dart';

class PharmacistRegisterScreen extends StatefulWidget {
  const PharmacistRegisterScreen({super.key});

  @override
  State<PharmacistRegisterScreen> createState() =>
      _PharmacistRegisterScreenState();
}

class _PharmacistRegisterScreenState extends State<PharmacistRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String registrationNumber = '';
  String email = '';
  String password = '';
  String contact = '';

  void handleRegister() async {
    if (_formKey.currentState!.validate()) {
      try {
        UserCredential user = await FirebaseAuth.instance
            .createUserWithEmailAndPassword(email: email, password: password);

        // Get actual FCM token
        String? fcmToken = await FirebaseMessaging.instance.getToken();

        await AuthService.registerPharmacist({
          "name": name,
          "registration_number": registrationNumber,
          "email": email,
          "firebase_uid": user.user!.uid,
          "contact_number": contact,
          "fcm_token": fcmToken,
        });

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } catch (e) {
        print("Pharmacist registration error: $e");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Registration failed. Try again."),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Pharmacist Registration")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: "Name"),
                onChanged: (val) => name = val,
                validator: (val) => val!.isEmpty ? "Enter name" : null,
              ),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: "Registration Number",
                ),
                onChanged: (val) => registrationNumber = val,
                validator: (val) =>
                    val!.isEmpty ? "Enter registration number" : null,
              ),
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
              TextFormField(
                decoration: const InputDecoration(labelText: "Contact Number"),
                onChanged: (val) => contact = val,
                validator: (val) => val!.isEmpty ? "Enter contact" : null,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: handleRegister,
                child: const Text("Register"),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const PharmacistLoginScreen(),
                    ),
                  );
                },
                child: const Text("Already have an account? Login here"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
