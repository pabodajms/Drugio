import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/pharmacy_service.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'message_screen.dart';
import '../widgets/footer.dart';

class PharmacyDetailScreen extends StatefulWidget {
  final dynamic pharmacy;

  const PharmacyDetailScreen({super.key, required this.pharmacy});

  @override
  State<PharmacyDetailScreen> createState() => _PharmacyDetailScreenState();
}

class _PharmacyDetailScreenState extends State<PharmacyDetailScreen> {
  List<dynamic> otherPharmacies = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadOtherNearbyPharmacies();
  }

  Future<void> _loadOtherNearbyPharmacies() async {
    try {
      final results = await PharmacyService.getNearbyPharmacies(
        widget.pharmacy['latitude'],
        widget.pharmacy['longitude'],
      );

      setState(() {
        otherPharmacies = results
            .where((p) => p['pharmacy_Id'] != widget.pharmacy['pharmacy_Id'])
            .toList();
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  void _launchPhone(String phone) async {
    final url = 'tel:$phone';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  void _launchSms(String phone) async {
    final url = 'sms:$phone';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  @override
  Widget build(BuildContext context) {
    final pharmacy = widget.pharmacy;

    return Scaffold(
      appBar: AppBar(title: Text(pharmacy['pharmacyName'])),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Selected Pharmacy Details
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        pharmacy['pharmacyName'],
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.location_on),
                          const SizedBox(width: 6),
                          Expanded(child: Text(pharmacy['address'])),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "${pharmacy['distance'].toStringAsFixed(2)} km away",
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.phone, color: Colors.blue),
                            onPressed: () =>
                                _launchPhone(pharmacy['contactNumber']),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.message,
                              color: Colors.orange,
                            ),
                            onPressed: () =>
                                _launchSms(pharmacy['contactNumber']),
                          ),
                          IconButton(
                            icon: const FaIcon(
                              FontAwesomeIcons.whatsapp,
                              color: Colors.green,
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => MessageScreen(
                                    selectedPharmacies: [pharmacy],
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Other Nearby Pharmacies
              const Text(
                "Other Nearby Pharmacies",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : Column(
                      children: otherPharmacies.map((p) {
                        return Card(
                          child: ListTile(
                            title: Text(p['pharmacyName']),
                            subtitle: Text(
                              "${p['distance'].toStringAsFixed(2)} km away",
                            ),
                            onTap: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (_) =>
                                      PharmacyDetailScreen(pharmacy: p),
                                ),
                              );
                            },
                          ),
                        );
                      }).toList(),
                    ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const Footer(),
    );
  }
}
