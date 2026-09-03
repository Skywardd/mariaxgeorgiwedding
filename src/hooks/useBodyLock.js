import { useEffect } from 'react'

// Брой активни „заключвания“ — така два наслагващи се слоя
// (пликът и лайтбоксът) не се отключват взаимно по грешка.
let locks = 0

/**
 * Спира превъртането на страницата, докато `locked` е true.
 *
 * Нарочно само `overflow: hidden`. Пробвано беше и закачане на тялото с
 * `position: fixed` (заедно със запомняне и връщане на позицията), защото
 * на телефон плъзгането с пръст все пак минава. Но на iPhone страницата
 * оставаше непревъртаема и след отключването, затова този подход отпадна.
 */
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
