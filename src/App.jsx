import { useState } from 'react'
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
