/**
 * Изгражда път до файл от папка `public`, съобразен с `base` от vite.config.js.
 * Така сайтът работи както от корена на домейна, така и от подпапка.
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

/**
 * Абсолютен адрес към файл от `public`.
 *
 * Нужен е, когато адресът се подава на CSS през променлива (`--logo`),
 * защото относителните адреси вътре в CSS се смятат спрямо самия CSS
 * файл, а не спрямо страницата. При готовия сайт стиловете стоят в
 * `/assets/`, та `./assets/x.svg` ставаше `/assets/assets/x.svg`.
 */
export const assetUrl = (path) =>
  typeof document === 'undefined'
    ? asset(path)
    : new URL(asset(path), document.baseURI).href

export const photoUrl = (file) => asset(`photos/${file}`)
export const thumbUrl = (file) => asset(`photos/thumb/${file}`)
