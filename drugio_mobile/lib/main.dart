import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:drugio_mobile/screens/role_selection_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const DrugioApp());
}

class DrugioApp extends StatelessWidget {
  const DrugioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Drugio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const RoleSelectionScreen(),
    );
  }
}
