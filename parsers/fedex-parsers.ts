import { ReservationFedex } from '@/models/models'


export default function FedexMail(): ReservationFedex {
    const resvType = (document.querySelectorAll('h2')[1].childNodes[4] as HTMLElement).textContent!.trim().includes('ADD') ? 'ADD' : 'CHANGE'
    const flightInfoTable = document.querySelectorAll('div tbody')[2].children
    const newResv = Array.from(flightInfoTable[flightInfoTable.length - 1].children) as HTMLElement[]

    const flightOut = newResv.at(-1)!.innerText.replace(' ', '')
    const [coDate, ETD] = parseDateString(newResv.at(-2)!.innerText)
    const [ciDate, ETA] = parseDateString(newResv.at(-3)!.innerText)
    const flightIn = newResv.at(-4)!.innerText.replace(' ', '')
    const stayHours = getStayHours(ciDate, ETA, coDate, ETD)
    const daysActual = getDaysActual(stayHours)
    const roomRatePerNight = parseFloat(newResv.at(-5)!.innerText) * 1.15
    const roomRates = Array(daysActual).fill(parseFloat(roomRatePerNight.toFixed(2)))
    const roomQty = Number(newResv.at(-6)!.innerText)

    const crewInfo = document.querySelector('div .content') as HTMLElement
    const crewNames = getCrewNames(crewInfo.innerText.split('\n')[0])
    const tripNum = crewInfo.parentElement!.nextElementSibling!.textContent!.split(' ')
    const tracking = Array.from(document.querySelectorAll('p')!).find(p => p.innerText.includes('Tracking'))!.innerText.split(' ').at(-1) as string

    return {
        identifier: '031709eafc20ab898d6b9e9860d31966',
        agent: 'fedex',
        resvType,
        crewNames,
        roomQty,
        ciDate,
        flightIn,
        ETA,
        flightOut,
        coDate,
        ETD,
        stayHours,
        daysActual,
        roomRates,
        tripNum: `${tripNum[5]}/${tripNum[7]}`,
        tracking
    }
}

function parseDateString(input: string) {
    const monthMap: { [key: string]: string } = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    }

    const [date, time, meridian] = input.split(' ')
    const year = `20${date.slice(-2)}`
    const month = monthMap[date.slice(2, 5)]
    const day = date.slice(0, 2)
    const formattedDate = `${year}-${month}-${day}`

    let formattedTime = ''
    const [h, m] = time.split(':')
    if (h === '12') {
        const newH = meridian === 'AM' ? '00' : '12'
        formattedTime = newH + ':' + m
    } else if (meridian === 'AM') {
        formattedTime = time
    } else {
        const newH = Number(h) + 12
        formattedTime = newH + ':' + m
    }

    return [formattedDate, formattedTime]
}

export function getStayHours(inboundDate: string, inboundTime: string, outboundDate: string, outboundTime: string): string {
    const [year1, month1, day1] = inboundDate.split('-').map(item => parseInt(item))
    const [h1, m1] = inboundTime.split(':').map(item => parseInt(item))
    const [year2, month2, day2] = outboundDate.split('-').map(item => parseInt(item))
    const [h2, m2] = outboundTime.split(':').map(item => parseInt(item))

    const date1 = new Date(year1, month1 - 1, day1, h1, m1)
    const date2 = new Date(year2, month2 - 1, day2, h2, m2)

    const timeDifference = date2.getTime() - date1.getTime()
    const hours = Math.floor(timeDifference / (1000 * 60 * 60))
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    const formattedHours = hours < 10 ? `0${hours}` : hours.toString()
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString()
    return `${formattedHours}:${formattedMinutes}`
}

export function getDaysActual(hoursAtHotel: string): number {
    const [h, m] = hoursAtHotel.split(':')
    const h2 = parseInt(h)
    if (h2 < 24) {
        return 1
    } else if (h2 % 24 === 0 && m === '00') {
        return Math.floor(h2 / 24)
    } else if (h2 >= 24 || m !== '00') {
        return Math.floor(h2 / 24 + 1)
    } else {
        return 0
    }
}

function getCrewNames(crewInfo: string): string[] {
    if (crewInfo.includes(',')) {
        const crewMembers = crewInfo.split(',')
        return [
            crewMembers[0].split('(')[0].split('-')[1].trim(),
            crewMembers[1].split('(')[0].split('-')[1].trim()
        ]
    } else {
        return [crewInfo.split('(')[0].split('-')[1].trim()]
    }
}