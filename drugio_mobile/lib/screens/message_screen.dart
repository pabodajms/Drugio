import 'package:flutter/material.dart';

class MessageScreen extends StatelessWidget {
  final List<dynamic> selectedPharmacies;

  const MessageScreen({super.key, required this.selectedPharmacies});

  @override
  Widget build(BuildContext context) {
    final isBulk = selectedPharmacies.length > 1;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isBulk
              ? 'Contact ${selectedPharmacies.length} Pharmacies'
              : 'Contact ${selectedPharmacies[0]['pharmacyName']}',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text('Write a message to check availability:'),
            const SizedBox(height: 16),
            TextField(
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Enter message...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                // here you would call WhatsApp bulk send
                // or loop over the pharmacies and open individual chats
              },
              icon: const Icon(Icons.send),
              label: Text(isBulk ? 'Send Bulk Message' : 'Send Message'),
            ),
          ],
        ),
      ),
    );
  }
}
