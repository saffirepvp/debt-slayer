export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, systemPrompt } = req.body;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  });
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || 'The advisor falls silent...';
  res.status(200).json({ text });
}