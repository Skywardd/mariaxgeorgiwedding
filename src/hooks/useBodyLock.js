import { useEffect } from 'react'

// Брой активни „заключвания“ — така два наслагващи се слоя
// (пликът и лайтбоксът) не се отключват взаимно по грешка.
let locks = 0

/**
 * Спира превъртането на страницата, докато `locked` е true.
 *
 * Ползва се от менюто и галерията — слоеве, които стоят кратко и от които
 * гостът се връща на същото място.
 *
 * Нарочно само `overflow: hidden`. Закачане с `position: fixed` беше
 * пробвано и остави страницата на iPhone непревъртаема след отключването.
 * Пликът пък изобщо не се заключва — на iOS `overflow: hidden` клампва
 * `scrollY` до нула, а той има нужда от истинската позиция.
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
