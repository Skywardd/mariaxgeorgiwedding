/**
 * Изгражда път до файл от папка `public`, съобразен с `base` от vite.config.js.
 * Така сайтът работи както от корена на домейна, така и от подпапка.
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const photoUrl = (file) => asset(`photos/${file}`)
export const thumbUrl = (file) => asset(`photos/thumb/${file}`)
