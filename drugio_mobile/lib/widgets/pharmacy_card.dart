import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class PharmacyCard extends StatelessWidget {
  final dynamic pharmacy;
  final bool isSelecting;
  final bool isSelected;
  final VoidCallback? onSelected;
  final VoidCallback? onTap; // <-- added

  const PharmacyCard({
    super.key,
    required this.pharmacy,
    this.isSelecting = false,
    this.isSelected = false,
    this.onSelected,
    this.onTap, // <-- added
  });

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
        leading: isSelecting
            ? Checkbox(
                value: isSelected,
                onChanged: (val) => onSelected?.call(),
              )
            : null,
        trailing: !isSelecting
            ? IconButton(
                icon: const Icon(Icons.message),
                onPressed: () =>
                    _launchWhatsApp(context, pharmacy['whatsappNumber']),
              )
            : null,
        onTap: onTap ?? (isSelecting ? onSelected : null),
      ),
    );
  }
}
