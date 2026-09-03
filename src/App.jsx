import { useEffect, useState } from 'react'
import useBodyLock from './hooks/useBodyLock'

import Envelope from './components/Envelope'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Song from './components/Song'
import Welcome from './components/Welcome'
import Countdown from './components/Countdown'
import Story from './components/Story'
import Venue from './components/Venue'
import Timeline from './components/Timeline'
import Witnesses from './components/Witnesses'
import DressCode from './components/DressCode'
import Gifts from './components/Gifts'
import Rsvp from './components/Rsvp'
import Faq from './components/Faq'
import Gallery from './components/Gallery'
import Footer from './components/Footer'

export default function App() {
  const [entered, setEntered] = useState(false)

  // Поканата винаги започва от плика най-горе. Иначе при презареждане
  // браузърът връща предишната позиция и гостът се озовава по средата.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // Без плавно превъртане — при зареждане то се вижда като ненужно
    // плъзгане на страницата.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Докато пликът е отпред, страницата отдолу не се превърта.
  useBodyLock(!entered)

  return (
    <>
      <Envelope onOpen={() => setEntered(true)} />

      <Nav />

      <main>
        <Hero />
        <Song />
        <Welcome />
        <Countdown />
        <Story />
        <Venue />
        <Timeline />
        <Witnesses />
        <DressCode />
        <Gifts />
        <Rsvp />
        <Faq />
        <Gallery />
      </main>

      <Footer />
    </>
  )
}
