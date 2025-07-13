import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:drugio_mobile/screens/home_screen.dart';
import 'package:drugio_mobile/services/auth_service.dart';

class PharmacistRegisterScreen extends StatefulWidget {
  const PharmacistRegisterScreen({super.key});

  @override
  State<PharmacistRegisterScreen> createState() =>
      _PharmacistRegisterScreenState();
}

class _PharmacistRegisterScreenState extends State<PharmacistRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String email = '';
  String password = '';
  String contact = '';

  void handleRegister() async {
    if (_formKey.currentState!.validate()) {
      try {
        UserCredential user = await FirebaseAuth.instance
            .createUserWithEmailAndPassword(email: email, password: password);

        await AuthService.registerPharmacist({
          "name": name,
          "email": email,
          "firebase_uid": user.user!.uid,
          "contact_number": contact,
          "fcm_token": "sample_fcm_token", // replace with real FCM token
        });

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } catch (e) {
        print("Pharmacist registration error: $e");
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
            ],
          ),
        ),
      ),
    );
  }
}
