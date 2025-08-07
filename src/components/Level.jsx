import React from 'react'

export default function Level({ question, answers, selectedAnswer, onSelect }) {
  return (
    <div className="level">
      <div className="question" role="heading" aria-level={2}>
        {question}
      </div>

      <ul className="answers" role="listbox" aria-label="Варианты ответа">
        {answers.map((text, idx) => {
          const isSelected = selectedAnswer === text
          return (
            <li key={idx} className={`answer ${isSelected ? 'selected' : ''}`}>
              <button
                type="button"
                className="answer-btn"
                aria-pressed={isSelected}
                onClick={() => onSelect(text)}
              >
                <span className="answer-index">{idx + 1}.</span>
                <span className="answer-text">{text}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}