// pages/api/evaluate.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = 'xai-EPBU27OUoQ5S68pOXklYgAf6ge0KcRNOCphGGYLbfWg1OMkH8AKDvarLyRsECJ5g098QAbint5QsjP71';
  const formData = req.body;

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-2-1212',
        messages: [
          {
            role: 'system',
            content: 'Du bist Immobiliengutachter mit jahrzehntelanger Erfahrung. Ermittle den datenbasierten Wert der Immobilie und gib eine Bewertungserklärung ab.',
          },
          {
            role: 'user',
            content: JSON.stringify(formData),
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'curl/8.12.1',
        },
        timeout: 30000,
      }
    );

    let content = response.data.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '');
    const evaluation = JSON.parse(content);

    res.status(200).json({ evaluation });
  } catch (error) {
    console.error('Grok API Error:', error.message);
    res.status(500).json({ error: 'Bewertung fehlgeschlagen', fallback: 'Bitte versuchen Sie es später erneut.' });
  }
}
