import 'package:flutter/material.dart';

class PrescriptionResponsesScreen extends StatelessWidget {
  final Map prescription;

  const PrescriptionResponsesScreen({super.key, required this.prescription});

  @override
  Widget build(BuildContext context) {
    final responses = prescription['responses'] ?? [];

    bool isPending = responses.isEmpty;
    String statusText = isPending ? "Pending" : "Responded";
    Color statusColor = isPending ? Colors.orange : Colors.green;

    return Scaffold(
      appBar: AppBar(
        title: Text("Prescription #${prescription['prescription_Id']}"),
      ),
      body: Column(
        children: [
          // Prescription Image
          if (prescription['image_url'] != null &&
              prescription['image_url'].toString().isNotEmpty)
            Image.network(
              prescription['image_url'],
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            )
          else
            Container(
              height: 200,
              color: Colors.grey[300],
              alignment: Alignment.center,
              child: const Text("No prescription image"),
            ),

          // Status Badge
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                const Text(
                  "Status:",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 4,
                    horizontal: 10,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(statusText, style: TextStyle(color: statusColor)),
                ),
              ],
            ),
          ),

          // Responses List
          Expanded(
            child: responses.isEmpty
                ? const Center(
                    child: Text(
                      "No responses from pharmacists yet.",
                      style: TextStyle(fontSize: 16),
                    ),
                  )
                : ListView.builder(
                    itemCount: responses.length,
                    itemBuilder: (context, index) {
                      final response = responses[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Pharmacist Response #${index + 1}",
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                "Suggested Medicines:",
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(response['suggested_medicines'] ?? '-'),
                              const SizedBox(height: 8),
                              Text(
                                "Directions:",
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(response['directions'] ?? '-'),
                              const SizedBox(height: 8),
                              Text(
                                "Pharmacist Comment:",
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(response['pharmacist_comment'] ?? '-'),
                              const SizedBox(height: 8),
                              Text(
                                "Response Date: ${response['response_date'] ?? '-'}",
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
