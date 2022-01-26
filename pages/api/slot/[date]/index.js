import { events, initEvents } from '/data/event.js'

const BankHolidays = [
    { dow: 'Friday', day: '15/04/2022', name: 'Good Friday' },
    { dow: 'Monday', day: '02/05/2022', name: 'Early May bank holiday' },
    { dow: 'Thursday', day: '02/06/2022', name: 'Spring bank holiday' },
    { dow: 'Friday', day: '03/06/2022', name: 'Platinum Jubilee bank holiday' },
    { dow: 'Monday', day: '01/08/2022', name: 'Summer bank holiday' },
    { dow: 'Wednesday', day: '30/11/2022', name: 'St Andrew’s Day' },
    { dow: 'Monday', day: '26/12/2022', name: 'Boxing Day' },
    { dow: 'Tuesday', day: '27/12/2022', name: 'Christmas Day (substitute day)' },
]

let unavailableDays
let dates = {}

function initUnavailableDays() {
    unavailableDays = events.concat(BankHolidays)
    unavailableDays.sort((a, b) => compareDatesToSort(a.day, b.day))
    unavailableDays.forEach((day) => {
        dates[day.day] = day
    })
}

function getValidDate(dateString) {
    dateString = dateString.replace(/-/g, '/')
    let result = {}
    let valid
    let min = 0
    let max = unavailableDays.length - 1
    let index

    // searching the day which is not available  
    while (min <= max) {
        index = Math.floor((min + max) / 2)
        const guess = unavailableDays[index].day
        const comparsion = compareDates(dateString, guess)
        if (comparsion === 'equal') {
            valid = false
            break
        }
        else if (comparsion === 'smaller') {
            max = index - 1
        }
        else {
            min = index + 1
        }
    }
    if (valid !== undefined && !valid) {
        let coefficient = 1
        let reachToday = false
        // Check the available date before and after
        while (true) {
            const [afterDate, afterDay] = calculateDate(dateString, coefficient)
            if (checkDateValid(afterDate, afterDay)) {
                result.valid = false
                result.validDate = afterDate
                return result
            }

            // Disable searching when the date before today
            if (!reachToday) {
                const [beforeDate, beforeDay] = calculateDate(dateString, -coefficient)
                if (checkReachedToday(beforeDate)) {
                    reachToday = true
                } else {
                    if (checkDateValid(beforeDate, beforeDay)) {
                        result.valid = false
                        result.validDate = beforeDate
                        return result
                    }
                }
            }
            coefficient++
        }
    } else {
        result.valid = true
        return result
    }
}

const msPerDay = 86400
function calculateDate(dateString, dayShift) {
    const dateArr = dateString.split('/')
    let date = new Date(dateString)
    date.setFullYear(parseInt(dateArr[0], 10))
    date.setMonth(parseInt(dateArr[1], 10) - 1)
    date.setDate(parseInt(dateArr[2]))
    let day = date.getDate()
    date.setDate(day + dayShift)
    return [`${fillWithZero(date.getDate())}/${fillWithZero(date.getMonth() + 1)}/${date.getFullYear()}`, date.getDay()]
}

function fillWithZero(number) {
    if (number < 10) {
        return `0${number}`
    } else {
        return number
    }
}

function checkDateValid(dateString, day) {
    return !dates[dateString] && day !== 0 && day !== 6
}

function checkReachedToday(dateString) {
    const today = new Date()
    let todayString = `${fillWithZero(today.getDate())}/${fillWithZero(today.getMonth() + 1)}/${today.getFullYear()}`
    return compareDatesToSort(dateString, todayString)
}


function compareDatesToSort(date1, date2) {
    let parts = date1.split('/')
    let d1 = parseInt(parts[2] + parts[1] + parts[0], 10)
    parts = date2.split('/')
    let d2 = parseInt(parts[2] + parts[1] + parts[0], 10)
    return d1 - d2
}

function compareDates(date1, date2) {
    let parts = date1.split('/')
    let d1 = parseInt(parts[0] + parts[1] + parts[2], 10)
    parts = date2.split('/')
    let d2 = parseInt(parts[2] + parts[1] + parts[0], 10)
    return d1 === d2 ? 'equal' : (d1 < d2 ? 'smaller' : 'larger')
}

export default function handler(req, res) {
    const { date } = req.query
    if (events.length === 0) {
        initEvents()
            .then((events) => {
                initUnavailableDays()
                let validDate = getValidDate(date)
                res.status(200).json({ date: validDate })
            })
            .catch((err) => {
                res.status(500).json({ message: 'Server error' })
            })
    } else {
        let validDate = getValidDate(date)
        res.status(200).json({ date: validDate })
    }
}
