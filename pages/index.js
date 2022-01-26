import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [earlyDate, setEarlyDate] = useState(() => {
    let date = new Date()
    return date.toISOString().substr(0, 10)
  })
  const [selectedDate, setSelectedDate] = useState(earlyDate)
  const [valid, setValid] = useState(false)
  const [recommendation, setRecommendation] = useState()
  function fetchAvailable() {
    fetch(`/api/slot/${selectedDate}`)
      .then(async (rep) => {
        const result = await rep.json()
        if (result.date.valid) {
          setValid(true)
        } else {
          setValid(false)
        }
        setRecommendation(result.date.validDate)
      })
  }

  function onClickHandle() {
    if (compareDates(selectedDate, earlyDate)) {
      alert('Your input is not valid')
    } else {
      fetchAvailable(selectedDate)
    }
  }

  function onChangeHandle(event) {
    setSelectedDate(event.target.value)
  }

  function compareDates(date1, date2) {
    let parts = date1.split('-')
    let d1 = parseInt(parts[0] + parts[1] + parts[2], 10)
    parts = date2.split('-')
    let d2 = parseInt(parts[0] + parts[1] + parts[2], 10)
    return d1 < d2
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Searching slot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <input type='date' min={earlyDate} value={selectedDate} onChange={onChangeHandle} />
        <button onClick={onClickHandle}> Search </button>

        {valid && 'Your input is valid'}
        {!valid && recommendation && <div>You result is not valid, Here is suggestion <p>{recommendation}</p></div>}
      </main>
    </div>
  )
}
