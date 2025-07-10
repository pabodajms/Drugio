import 'package:flutter/material.dart';
import '../services/location_service.dart';
import '../services/pharmacy_service.dart';
import '../widgets/pharmacy_card.dart';
import 'message_screen.dart';

class NearbyPharmaciesScreen extends StatefulWidget {
  const NearbyPharmaciesScreen({super.key});

  @override
  State<NearbyPharmaciesScreen> createState() => _NearbyPharmaciesScreenState();
}

class _NearbyPharmaciesScreenState extends State<NearbyPharmaciesScreen> {
  List<dynamic> pharmacies = [];
  bool isLoading = true;
  String errorMessage = '';
  bool isSelecting = false;
  Set<int> selectedPharmacies = {};

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

  void toggleSelecting() {
    setState(() {
      isSelecting = !isSelecting;
      if (!isSelecting) {
        selectedPharmacies.clear();
      }
    });
  }

  void toggleSelection(int pharmacyId) {
    setState(() {
      if (selectedPharmacies.contains(pharmacyId)) {
        selectedPharmacies.remove(pharmacyId);
      } else {
        selectedPharmacies.add(pharmacyId);
      }
    });
  }

  void selectAll() {
    setState(() {
      if (selectedPharmacies.length == pharmacies.length) {
        selectedPharmacies.clear();
      } else {
        selectedPharmacies = pharmacies
            .map<int>((p) => p['pharmacy_Id'] as int)
            .toSet();
      }
    });
  }

  void goToMessageScreen() {
    final selected = pharmacies
        .where((p) => selectedPharmacies.contains(p['pharmacy_Id']))
        .toList();

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => MessageScreen(selectedPharmacies: selected),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // DEBUG: print the current state to console
    print(
      'DEBUG: isLoading=$isLoading, pharmacies=${pharmacies.length}, errorMessage=$errorMessage',
    );
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nearby Pharmacies'),
        actions: [
          if (!isLoading && pharmacies.isNotEmpty)
            TextButton(
              onPressed: toggleSelecting,
              child: Text(
                isSelecting ? 'Cancel' : 'Select',
                style: const TextStyle(color: Colors.blue),
              ),
            ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage.isNotEmpty
          ? Center(child: Text(errorMessage))
          : pharmacies.isEmpty
          ? const Center(child: Text('No nearby pharmacies found'))
          : Column(
              children: [
                if (isSelecting)
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: Row(
                      children: [
                        ElevatedButton(
                          onPressed: selectAll,
                          child: Text(
                            selectedPharmacies.length == pharmacies.length
                                ? 'Unselect All'
                                : 'Select All',
                          ),
                        ),
                      ],
                    ),
                  ),
                Expanded(
                  child: ListView.builder(
                    itemCount: pharmacies.length,
                    itemBuilder: (context, index) {
                      final pharmacy = pharmacies[index];
                      final pharmacyId = pharmacy['pharmacy_Id'];

                      return PharmacyCard(
                        pharmacy: pharmacy,
                        isSelecting: isSelecting,
                        isSelected: selectedPharmacies.contains(pharmacyId),
                        onSelected: () => toggleSelection(pharmacyId),
                      );
                    },
                  ),
                ),
              ],
            ),
      bottomNavigationBar: isSelecting && selectedPharmacies.isNotEmpty
          ? Padding(
              padding: const EdgeInsets.all(8),
              child: ElevatedButton.icon(
                onPressed: goToMessageScreen,
                icon: const Icon(Icons.message),
                label: Text(
                  selectedPharmacies.length == 1
                      ? 'Send Message'
                      : 'Send Bulk Message',
                ),
              ),
            )
          : null,
    );
  }
}
