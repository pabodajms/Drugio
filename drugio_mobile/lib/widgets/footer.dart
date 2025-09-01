import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 50,
      child: Container(
        color: Colors.grey[200],
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: const Center(
          child: Text(
            "© 2025 Drugio. All rights reserved.",
            style: TextStyle(fontSize: 14, color: Colors.black54),
          ),
        ),
      ),
    );
  }
}
