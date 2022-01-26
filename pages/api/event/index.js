import {events, initEvents} from '/data/event'

export default function handler(req, res) {
    if (events.length === 0) {
        initEvents()
            .then(() => {
                res.status(200).json({ events })
            })
            .catch(() => {
                res.status(500).json({ message: 'Server error' })
            })
    } else {
        res.status(200).json({ events })
    }
}
