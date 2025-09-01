import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../widgets/footer.dart';

class MessageScreen extends StatefulWidget {
  final List<dynamic> selectedPharmacies;

  const MessageScreen({super.key, required this.selectedPharmacies});

  @override
  State<MessageScreen> createState() => _MessageScreenState();
}

class _MessageScreenState extends State<MessageScreen> {
  final TextEditingController _controller = TextEditingController();
  int _currentIndex = 0;
  bool _isSending = false;

  Future<void> _launchWhatsApp(String phone, String message) async {
    String formattedPhone = phone.replaceAll(RegExp(r'\s+'), '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = formattedPhone.replaceFirst('0', '94');
    }

    final url = Uri.parse(
      'https://wa.me/$formattedPhone?text=${Uri.encodeComponent(message)}',
    );

    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not open WhatsApp for $phone')),
      );
    }
  }

  Future<void> sendMessagesSequentially() async {
    if (_isSending) return;

    final message = _controller.text.trim();
    if (message.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please type a message')));
      return;
    }

    setState(() {
      _isSending = true;
    });

    for (int i = _currentIndex; i < widget.selectedPharmacies.length; i++) {
      final pharmacy = widget.selectedPharmacies[i];
      final phone = pharmacy['whatsappNumber'];

      if (phone != null && phone.toString().trim().isNotEmpty) {
        await _launchWhatsApp(phone, message);

        setState(() {
          _currentIndex = i + 1;
        });

        if (_currentIndex < widget.selectedPharmacies.length) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Message sent to ${pharmacy['pharmacyName']}. Return to app to continue.',
              ),
              duration: const Duration(seconds: 5),
            ),
          );
          break;
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('All messages have been sent.'),
              duration: Duration(seconds: 3),
            ),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Pharmacy "${pharmacy['pharmacyName']}" has no WhatsApp number.',
            ),
          ),
        );
      }
    }

    setState(() {
      _isSending = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isBulk = widget.selectedPharmacies.length > 1;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isBulk
              ? 'Contact ${widget.selectedPharmacies.length} Pharmacies'
              : 'Contact ${widget.selectedPharmacies[0]['pharmacyName']}',
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text('Write a message to check availability:'),
            const SizedBox(height: 16),
            TextField(
              controller: _controller,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Enter message...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: sendMessagesSequentially,
              icon: const Icon(Icons.send),
              label: Text(
                isBulk
                    ? (_currentIndex >= widget.selectedPharmacies.length
                          ? 'All Sent'
                          : 'Send Bulk Message (${_currentIndex + 1}/${widget.selectedPharmacies.length})')
                    : 'Send Message',
              ),
            ),
          ],
        ),
      ),

      bottomNavigationBar: const Footer(),
    );
  }
}
