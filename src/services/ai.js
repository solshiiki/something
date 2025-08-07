async function tryWindowAI(prompt) {
  try {
    if (typeof window !== 'undefined' && window.ai && window.ai.createTextSession) {
      const session = await window.ai.createTextSession({ temperature: 0.7 })
      const text = await session.prompt(prompt)
      return String(text)
    }
  } catch (_e) {
    // ignore and fall through
  }
  return null
}

async function tryOpenAI(prompt) {
  const apiKey = import.meta?.env?.VITE_OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Ты — психолог, объясняешь ясно и коротко.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!resp.ok) return null
    const data = await resp.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    return text || null
  } catch (_e) {
    return null
  }
}

function mockResponse(prompt) {
  // Very small heuristic mock just to keep UI functional without keys
  const answerMatch = prompt.match(/Его ответ: '([^']+)'/)
  const answer = answerMatch ? answerMatch[1].toLowerCase() : ''

  let bias = 'Когнитивное искажение'
  let explanation = 'Наш мозг экономит усилия и подменяет строгий анализ быстрыми эвристиками.'
  let example = 'Например, мы делаем выводы по первому впечатлению или держимся за первоначальную гипотезу.'
  let tip = 'Замедлись: пропиши альтернативные объяснения и проверь факты вторым взглядом.'

  if (answer.includes('конечно')) {
    bias = 'Иллюзия объективности и предвзятость слепого пятна'
    explanation = 'Склонность считать себя (и других) рациональными и недооценивать влияние эмоций и контекста.'
    example = 'Коллега уверяет, что выбрал поставщика “по цифрам”, хотя на выбор повлияла симпатия и знакомый бренд.'
    tip = 'Спроси себя: какие эмоции и внешние факторы могли повлиять? Запиши 2–3 альтернативы.'
  } else if (answer.includes('иногда')) {
    bias = 'Эффект подтверждения'
    explanation = 'Ищем данные, поддерживающие нашу промежуточную позицию, и игнорируем противоречия.'
    example = 'Читаем только статьи, где “иногда” эмоции важны, пропуская радикально иные точки зрения.'
    tip = 'Найди источник с противоположной позицией и выпиши 3 аргумента “против”.'
  } else if (answer.includes('нет') || answer.includes('эмоции')) {
    bias = 'Эвристика аффекта'
    explanation = 'Решения часто ведёт эмоциональный след, а не расчёт — особенно под давлением времени.'
    example = 'Покупаем гаджет из-за восторга от презентации, а не из-за реальной необходимости.'
    tip = 'Перед выбором оцени: какие эмоции я сейчас чувствую? Подожди 24 часа и пересмотри.'
  }

  return `${bias}. ${explanation} Пример: ${example}. Что делать: ${tip}`
}

export async function analyzeAnswer(prompt) {
  const viaWindow = await tryWindowAI(prompt)
  if (viaWindow) return viaWindow

  const viaOpenAI = await tryOpenAI(prompt)
  if (viaOpenAI) return viaOpenAI

  // Fallback mock
  await new Promise((r) => setTimeout(r, 700))
  return mockResponse(prompt)
}