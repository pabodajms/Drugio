import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class PharmacyCard extends StatelessWidget {
  final dynamic pharmacy;

  const PharmacyCard({super.key, required this.pharmacy});

  void _launchWhatsApp(BuildContext context, String phone) async {
    final url = 'https://wa.me/$phone';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not launch WhatsApp')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8),
      child: ListTile(
        title: Text(pharmacy['pharmacyName']),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(pharmacy['address']),
            Text('${pharmacy['distance'].toStringAsFixed(2)} km away'),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.message),
          onPressed: () => _launchWhatsApp(context, pharmacy['whatsappNumber']),
        ),
      ),
    );
  }
}
