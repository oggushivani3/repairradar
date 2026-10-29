/**
 * Vercel Serverless Function: /api/diagnose
 * 
 * Safely handles AI API requests on the backend without exposing keys to the client.
 * If GEMINI_API_KEY is configured, queries Google Gemini with a structured prompt.
 * Otherwise, falls back to the domain diagnostic logic.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { device, problem, brand, model, age } = req.body || {}

  if (!problem || typeof problem !== 'string' || !problem.trim()) {
    return res.status(400).json({ error: 'Problem description is required.' })
  }

  // Reject random characters, keyboard mashing, or 0-vowel words
  const clean = problem.trim().toLowerCase()
  const vowels = (clean.match(/[aeiouy]/gi) || []).length
  if (clean.length >= 4 && vowels === 0 && !/^(tv|mcb|pcb|bsod|usb|ram|ssd|led|lcd)$/i.test(clean)) {
    return res.status(400).json({ error: `Could not recognize any valid symptoms from "${problem}". Please describe what is wrong with the device.` })
  }
  if (/^(.)\1{2,}$/.test(clean) || /^[^a-z]+$/i.test(clean)) {
    return res.status(400).json({ error: `Please describe what is happening with your device in words.` })
  }

  const geminiApiKey = process.env.GEMINI_API_KEY

  if (geminiApiKey) {
    try {
      const prompt = `You are RepairRadar's AI Repair Advisor for India.
Analyze this repair issue and return a valid JSON object only.

Device category: ${device || 'General Device'}
${brand ? `Brand: ${brand}` : ''}
${model ? `Model: ${model}` : ''}
${age ? `Age: ${age} years` : ''}
Problem description: "${problem}"

Guidelines:
1. "cause": Specific likely mechanical or electronic root cause for this exact reported issue.
2. "secondaryCauses": Array of 1-3 other plausible causes.
3. "confidence": Number (10-95) estimating diagnostic confidence based on symptom specificity.
4. "confidenceExplanation": Brief 1-sentence explanation of why this confidence level was assigned.
5. "priceMin" and "priceMax": Realistic repair cost estimate in Indian Rupees (INR) for parts + labor in India. Do not invent unrealistic prices.
6. "recommendation": One of "DIY Troubleshooting", "Hire a Pro", or "Consider Replacement".
7. "recommendationReason": Brief explanation why.
8. "redFlags": Array of 2 safety warnings or overcharge traps to watch out for.
9. "nextSteps": Array of 3 practical, step-by-step diagnostic checks the user can perform.

Respond ONLY with valid JSON conforming to this schema:
{
  "cause": string,
  "secondaryCauses": string[],
  "confidence": number,
  "confidenceExplanation": string,
  "priceMin": number,
  "priceMax": number,
  "recommendation": string,
  "recommendationReason": string,
  "redFlags": string[],
  "nextSteps": string[]
}`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          const parsed = JSON.parse(text)
          return res.status(200).json(parsed)
        }
      }
    } catch (err) {
      console.error('Gemini API diagnosis failed, falling back:', err)
    }
  }

  // If no API key or API call fails, return 204 or error so client uses local engine
  return res.status(503).json({ error: 'AI API unavailable. Client fallback active.' })
}
