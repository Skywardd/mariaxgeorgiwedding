import { useEffect } from 'react'

// Брой активни „заключвания“ — така два наслагващи се слоя
// (пликът и лайтбоксът) не се отключват взаимно по грешка.
let locks = 0

/** Спира превъртането на страницата, докато `locked` е true. */
export default function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return

    locks += 1
    document.body.classList.add('is-locked')

    return () => {
      locks -= 1
      if (locks === 0) document.body.classList.remove('is-locked')
    }
  }, [locked])
}
