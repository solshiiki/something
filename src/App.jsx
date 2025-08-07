import React, { useState } from 'react'
import { levels } from './data/levels.js'
import { analyzeAnswer } from './services/ai.js'
import Level from './components/Level.jsx'

export default function App() {
  const [currentLevelIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiResponse, setAiResponse] = useState('')

  const level = levels[currentLevelIndex]

  async function handleChoose() {
    if (!selectedAnswer || isSubmitting) return
    setIsSubmitting(true)
    setAiResponse('')

    const prompt = `Пользователь прошёл уровень когнитивной игры. Вопрос: '${level.question}'. Его ответ: '${selectedAnswer}'. Проанализируй, какой тип когнитивного искажения проявился (если проявился), объясни эффект, приведи пример из жизни и предложи способ осознать это и выйти из ловушки мышления. Отвечай кратко и по-человечески.`

    try {
      const response = await analyzeAnswer(prompt)
      setAiResponse(response)
    } catch (error) {
      setAiResponse('Не удалось получить ответ от AI. Попробуйте ещё раз позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-root">
      <main className="game-container">
        <header className="header">
          <h1 className="title">Mind Prison Break</h1>
          <p className="subtitle">Освобождайся от когнитивных ловушек</p>
        </header>

        <section className="level-section">
          <Level
            question={level.question}
            answers={level.answers}
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
          />

          <div className="actions-row">
            <button
              className="primary-btn"
              onClick={handleChoose}
              disabled={!selectedAnswer || isSubmitting}
            >
              {isSubmitting ? 'Анализ…' : 'Выбрать'}
            </button>

            <button className="secondary-btn" disabled>
              Следующий уровень
            </button>
          </div>

          <div className={`ai-response ${aiResponse ? 'visible' : ''}`} aria-live="polite">
            {aiResponse && <p>{aiResponse}</p>}
          </div>
        </section>

        <footer className="footer">
          <small>
            Уровень {currentLevelIndex + 1} из {levels.length}. Далее будут: эффект привязки, якоря, ошибка выжившего, слепое пятно предвзятости…
          </small>
        </footer>
      </main>
    </div>
  )
}