const path = require('path')
const fs = require('fs')


const csvPath = './db/events_2022.csv'

export let events = []

export function initEvents() {
    return new Promise((resolve, reject) => {
        fs.readFile(csvPath, 'utf-8', (err, data) => {
            if (err) reject(err)
            const tableData = data.trim().split('\n')
            tableData.shift()
            events = tableData.map(rowString => {
                const row = rowString.split(',')
                return {
                    dow: row[0],
                    day: row[1],
                    name: row[2]
                }
            })
            resolve(events)
        })
    })
}
