import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 50, // fixed height so it doesn't cover the whole screen
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
