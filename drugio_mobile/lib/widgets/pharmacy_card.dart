import 'package:flutter/material.dart';
import '../screens/message_screen.dart';

class PharmacyCard extends StatelessWidget {
  final dynamic pharmacy;
  final bool isSelecting;
  final bool isSelected;
  final VoidCallback? onSelected;
  final VoidCallback? onTap;

  const PharmacyCard({
    super.key,
    required this.pharmacy,
    this.isSelecting = false,
    this.isSelected = false,
    this.onSelected,
    this.onTap,
  });

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
                icon: const Icon(Icons.message, color: Colors.green),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) =>
                          MessageScreen(selectedPharmacies: [pharmacy]),
                    ),
                  );
                },
              )
            : null,
        onTap: onTap ?? (isSelecting ? onSelected : null),
      ),
    );
  }
}
