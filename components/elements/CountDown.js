'use client'
import { useEffect, useState } from "react"

const msInSecond = 1000
const msInMinute = 60 * 1000
const msInAHour = 60 * msInMinute
const msInADay = 24 * msInAHour

const getPartsofTimeDuration = (duration) => {
    const days = Math.floor(duration / msInADay)
    const hours = Math.floor((duration % msInADay) / msInAHour)
    const minutes = Math.floor((duration % msInAHour) / msInMinute)
    const seconds = Math.floor((duration % msInMinute) / msInSecond)

    return { days, hours, minutes, seconds }
}

const Countdown = (endDateTime) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        const timeout = setTimeout(() => {
            const date = new Date()
            setTime(date.toLocaleTimeString())
        }, 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [time])

    const now = Date.now() // Number of milliseconds from begining of time

    const future = new Date(endDateTime.endDateTime) // The day we leave for Japan

    const timeDif = future.getTime() - now
    const timeParts = getPartsofTimeDuration(timeDif)

    // const countDownTime = `${timeParts.days} Days ${timeParts.hours} Hours and ${timeParts.minutes} minutes and ${timeParts.seconds} seconds`;
    return (
        <>
            <span className="cdown days"> <span className="time-count">{timeParts.days}</span>
                <p>Days</p>
            </span>
            <span className="cdown hour"> <span className="time-count">{timeParts.hours}</span>
                <p>Hour</p>
            </span>
            <span className="cdown minutes"> <span className="time-count">{timeParts.minutes}</span>
                <p>Minute</p>
            </span>
            <span className="cdown second"> <span className="time-count">{timeParts.seconds}</span>
                <p>Second</p>
            </span>


        </>
    )
}

export default Countdown