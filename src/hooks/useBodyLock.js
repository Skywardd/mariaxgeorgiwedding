import { useEffect } from 'react'

// Брой активни „заключвания“ — така два наслагващи се слоя
// (пликът и лайтбоксът) не се отключват взаимно по грешка.
let locks = 0
// Позицията, от която е започнало първото заключване.
let savedY = 0

/**
 * Спира превъртането на страницата, докато `locked` е true.
 *
 * Тялото се закача с `position: fixed` (виж `body.is-locked`), защото на
 * телефон само `overflow: hidden` не спира плъзгането с пръст. Заради това
 * позицията се запомня и се връща при отключване — иначе гостът щеше да
 * отскача най-горе всеки път, когато затвори снимка от галерията.
 */
export default function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return

    if (locks === 0) {
      savedY = window.scrollY
      document.body.style.top = `${-savedY}px`
      document.documentElement.classList.add('is-locked')
      document.body.classList.add('is-locked')
    }
    locks += 1

    return () => {
      locks -= 1
      if (locks > 0) return

      document.documentElement.classList.remove('is-locked')
      document.body.classList.remove('is-locked')
      document.body.style.top = ''
      window.scrollTo(0, savedY)
    }
  }, [locked])
}
