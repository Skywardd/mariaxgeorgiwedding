import { useState } from 'react'
import { rsvp } from '../content'

const { form } = rsvp

// `formId` е ID-то на документа (от адреса на формата, между `/d/` и `/edit`).
// Ако някога се използва публичното ID (то започва с `1FAIpQLS`), пътят
// трябва да е `/forms/d/e/<id>/formResponse`.
const endpoint = (formId) =>
  formId.startsWith('1FAIpQLS')
    ? `https://docs.google.com/forms/d/e/${formId}/formResponse`
    : `https://docs.google.com/forms/d/${formId}/formResponse`

/**
 * Формата изглежда като част от сайта, но изпраща данните към Google Форма.
 * Google не позволява четене на отговора от друг домейн (`no-cors`), затова
 * след успешно изпращане показваме благодарност, без да чакаме потвърждение.
 */
async function sendToGoogleForm(values) {
  const body = new URLSearchParams()

  const append = (field, value) => {
    if (field && value) body.append(field, value)
  }

  const coming = values.attending === form.attendingOptions.yes
  const withSecond = coming && hasSecondGuest(values)
  append(form.fields.name, values.name.trim())
  append(form.fields.attending, values.attending)
  append(form.fields.guests, coming ? values.guests : '')
  append(form.fields.menu, coming ? values.menu : '')
  append(form.fields.guest2Name, withSecond ? values.guest2Name.trim() : '')
  append(form.fields.guest2Menu, withSecond ? values.guest2Menu : '')
  append(form.fields.diet, values.diet.trim())
  append(form.fields.message, values.message.trim())

  await fetch(endpoint(form.formId), {
    method: 'POST',
    mode: 'no-cors',
    body,
  })
}

/**
 * Второ, независимо копие на отговора. За разлика от Google, тези услуги
 * връщат нормален отговор с CORS — тук наистина знаем дали е записано.
 * Ако не е настроено, функцията не прави нищо.
 */
async function sendBackup(values) {
  const { url, accessKey, subject } = rsvp.backup || {}
  if (!url) return { skipped: true }

  const coming = values.attending === form.attendingOptions.yes
  const withSecond = coming && hasSecondGuest(values)

  const payload = {
    subject,
    'Име и фамилия': values.name.trim(),
    'Ще присъства': values.attending,
    'Брой гости': coming ? values.guests : '',
    Меню: coming ? values.menu : '',
    'Втори гост': withSecond ? values.guest2Name.trim() : '',
    'Меню на втория гост': withSecond ? values.guest2Menu : '',
    Алергии: values.diet.trim(),
    Съобщение: values.message.trim(),
    Изпратено: new Date().toISOString(),
  }
  if (accessKey) payload.access_key = accessKey

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error(`Резервното копие върна ${response.status}`)
  return { saved: true }
}

const emptyValues = {
  name: '',
  attending: '',
  // Празно, за да избере гостът броя съзнателно.
  guests: '',
  menu: '',
  guest2Name: '',
  guest2Menu: '',
  diet: '',
  message: '',
}

/** При двама гости питаме за името и менюто и на втория. */
const hasSecondGuest = (values) => Number(values.guests) > 1

function Required() {
  return (
    <span className="field__required" aria-hidden="true">
      {form.labels.requiredMark}
    </span>
  )
}

export default function RsvpForm() {
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') 
  const isConfigured = Boolean(form.formId && form.fields.name)
  const isPreview = form.preview || !isConfigured

  const update = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const choose = (key) => (value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const isComing = values.attending === form.attendingOptions.yes
  const showSecondGuest = isComing && hasSecondGuest(values)

  // При връщане към един гост полетата за втория се изчистват — иначе
  // тръгва отговор, който гостът вече не вижда на екрана.
  const updateGuests = (event) => {
    const guests = event.target.value
    const second = Number(guests) > 1
    setValues((prev) => ({
      ...prev,
      guests,
      guest2Name: second ? prev.guest2Name : '',
      guest2Menu: second ? prev.guest2Menu : '',
    }))
    setErrors((prev) => ({
      ...prev,
      guests: undefined,
      guest2Name: undefined,
      guest2Menu: undefined,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = form.errors.name
    if (!values.attending) nextErrors.attending = form.errors.attending
    if (isComing && !values.guests) nextErrors.guests = form.errors.guests
    if (isComing && !values.menu) nextErrors.menu = form.errors.menu
    if (showSecondGuest && !values.guest2Name.trim()) {
      nextErrors.guest2Name = form.errors.guest2Name
    }
    if (showSecondGuest && !values.guest2Menu) {
      nextErrors.guest2Menu = form.errors.guest2Menu
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    if (isPreview) {
      // Демо режим: нищо не се изпраща.
      console.warn('[RSVP] Демо режим — отговорът не е изпратен.', values)
      setStatus('done')
      return
    }

    setStatus('sending')

    // Двете места се пълнят паралелно — провалът на едното не спира другото.
    const [google, backup] = await Promise.allSettled([
      sendToGoogleForm(values),
      sendBackup(values),
    ])

    const backupConfigured = Boolean(rsvp.backup?.url)
    const backupSaved = backup.status === 'fulfilled' && backup.value?.saved
    const googleSent = google.status === 'fulfilled'

    // Грешка само ако наистина никъде не е стигнало. Заявката към Google
    // не може да се провери (`no-cors`), затова, ако резервното копие е
    // записано, отговорът е в безопасност дори Google да го е отказал.
    if (!googleSent && (!backupConfigured || !backupSaved)) {
      if (backup.status === 'rejected') console.error('[RSVP]', backup.reason)
      setStatus('error')
      return
    }

    if (backupConfigured && !backupSaved) {
      console.warn('[RSVP] Резервното копие не бе записано.', backup.reason)
    }

    setStatus('done')
  }

  if (status === 'done') {
    const message = isComing ? form.success.yes : form.success.no

    return (
      <div className="rsvp-form__done" role="status">
        <p className="rsvp-form__done-title">{message.title}</p>
        <p className="rsvp-form__done-text">{message.text}</p>
      </div>
    )
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      {isPreview && <p className="rsvp-form__preview">{form.previewNotice}</p>}

      <div className="field">
        <label className="field__label" htmlFor="rsvp-name">
          {form.labels.name}
          <Required />
        </label>
        <input
          className="field__input"
          id="rsvp-name"
          name="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          value={values.name}
          onChange={update('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
        />
        {errors.name && (
          <p className="field__error" id="rsvp-name-error">
            {errors.name}
          </p>
        )}
      </div>

      <fieldset className="field field--choice" aria-required="true">
        <legend className="field__label">
          {form.labels.attending}
          <Required />
        </legend>
        <div className="choice">
          {[form.attendingOptions.yes, form.attendingOptions.no].map((option) => (
            <button
              type="button"
              key={option}
              className={[
                'choice__option',
                values.attending === option && 'is-selected',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={values.attending === option}
              onClick={() => choose('attending')(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {errors.attending && <p className="field__error">{errors.attending}</p>}
      </fieldset>

      {isComing && (
        <>
          <div className="field">
            <label className="field__label" htmlFor="rsvp-guests">
              {form.labels.guests}
              <Required />
            </label>
            <select
              className={[
                'field__input',
                'field__input--select',
                !values.guests && 'is-placeholder',
              ]
                .filter(Boolean)
                .join(' ')}
              id="rsvp-guests"
              name="guests"
              aria-required="true"
              value={values.guests}
              onChange={updateGuests}
              aria-invalid={Boolean(errors.guests)}
            >
              <option value="" disabled>
                {form.guestsPlaceholder}
              </option>
              {form.guestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.guests && <p className="field__error">{errors.guests}</p>}
          </div>

          <fieldset className="field field--choice" aria-required="true">
            <legend className="field__label">
              {form.labels.menu}
              <Required />
            </legend>
            <div className="choice">
              {form.menuOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={[
                    'choice__option',
                    values.menu === option && 'is-selected',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={values.menu === option}
                  onClick={() => choose('menu')(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.menu && <p className="field__error">{errors.menu}</p>}
          </fieldset>

          {showSecondGuest && (
            <>
              <div className="field">
                <label className="field__label" htmlFor="rsvp-guest2-name">
                  {form.labels.guest2Name}
                  <Required />
                </label>
                <input
                  className="field__input"
                  id="rsvp-guest2-name"
                  name="guest2Name"
                  type="text"
                  aria-required="true"
                  value={values.guest2Name}
                  onChange={update('guest2Name')}
                  aria-invalid={Boolean(errors.guest2Name)}
                  aria-describedby={
                    errors.guest2Name ? 'rsvp-guest2-name-error' : undefined
                  }
                />
                {errors.guest2Name && (
                  <p className="field__error" id="rsvp-guest2-name-error">
                    {errors.guest2Name}
                  </p>
                )}
              </div>

              <fieldset className="field field--choice" aria-required="true">
                <legend className="field__label">
                  {form.labels.guest2Menu}
                  <Required />
                </legend>
                <div className="choice">
                  {form.menuOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={[
                        'choice__option',
                        values.guest2Menu === option && 'is-selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-pressed={values.guest2Menu === option}
                      onClick={() => choose('guest2Menu')(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.guest2Menu && (
                  <p className="field__error">{errors.guest2Menu}</p>
                )}
              </fieldset>
            </>
          )}

          <div className="field">
            <label className="field__label" htmlFor="rsvp-diet">
              {form.labels.diet}
            </label>
            <input
              className="field__input"
              id="rsvp-diet"
              name="diet"
              type="text"
              value={values.diet}
              onChange={update('diet')}
            />
          </div>
        </>
      )}

      <div className="field">
        <label className="field__label" htmlFor="rsvp-message">
          {form.labels.message}
        </label>
        <textarea
          className="field__input field__input--area"
          id="rsvp-message"
          name="message"
          rows="3"
          value={values.message}
          onChange={update('message')}
        />
      </div>

      {status === 'error' && (
        <p className="field__error field__error--block" role="alert">
          {form.errors.send}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--solid rsvp-form__submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? form.labels.sending : form.labels.submit}
      </button>
    </form>
  )
}
