import 'package:flutter/material.dart';
import '../services/location_service.dart';
import '../services/pharmacy_service.dart';
import '../widgets/pharmacy_card.dart';

class NearbyPharmaciesScreen extends StatefulWidget {
  const NearbyPharmaciesScreen({super.key});

  @override
  State<NearbyPharmaciesScreen> createState() => _NearbyPharmaciesScreenState();
}

class _NearbyPharmaciesScreenState extends State<NearbyPharmaciesScreen> {
  List<dynamic> pharmacies = [];
  bool isLoading = true;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    _loadNearbyPharmacies();
  }

  Future<void> _loadNearbyPharmacies() async {
    try {
      final position = await LocationService.getCurrentPosition();

      if (position == null) {
        setState(() {
          isLoading = false;
          errorMessage = "Location permission denied.";
        });
        return;
      }

      final results = await PharmacyService.getNearbyPharmacies(
        position.latitude,
        position.longitude,
      );

      setState(() {
        pharmacies = results;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = 'Error: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nearby Pharmacies')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage.isNotEmpty
          ? Center(child: Text(errorMessage))
          : pharmacies.isEmpty
          ? const Center(child: Text('No nearby pharmacies found'))
          : ListView.builder(
              itemCount: pharmacies.length,
              itemBuilder: (context, index) =>
                  PharmacyCard(pharmacy: pharmacies[index]),
            ),
    );
  }
}
