import { ReservationOTA } from '@/models/models'

const parserMap: Map<string, Function> = new Map()
export default parserMap

// query models
parserMap.set('kingsley', Kingsley)
function Kingsley(): ReservationOTA {
	const orderId = document.querySelectorAll('.STYLE43')[3].nextSibling!.textContent!.trim()

	const guestNamesText = (document.querySelectorAll('.square42')[1] as HTMLElement).innerText.trim()
	const separator = ['、', ',', '，'].find(s => guestNamesText.includes(s))
	const guestNames = separator ? guestNamesText.split(separator) : [guestNamesText]

	const roomTypeText = (Array.from(document.querySelectorAll('div'))
		.find(div => div.innerText === '房间种类：')!
		.parentElement!
		.nextElementSibling as HTMLElement)
		.innerText.trim()

	let roomType = ''
	if (roomTypeText.includes('(')) {
		roomType = roomTypeText.split('(')[0].trim()
	} else if (roomTypeText.includes('（')) {
		roomType = roomTypeText.split('（')[0].trim()
	} else {
		roomType = roomTypeText.trim()
	}

	const orderIdText = (document.querySelectorAll('.square426')[1] as HTMLElement).innerText
	const bbf = orderIdText.includes('不含早') ? 0 : orderIdText.includes('单早') ? 1 : 2

	const stayTable = document.querySelectorAll('table')[2].children[0]
	const ciDate = stayTable.children[1].children[0].textContent!.trim().replace(/[^0-9]/gi, '-').slice(0, 10)
	const coDate = stayTable.children[stayTable.childElementCount - 1].children[1].textContent!.trim().replace(/[^0-9]/gi, '-').slice(0, 10)
	const roomQty = Number(stayTable.children[1].children[2].textContent)

	const rateInfoText = document.querySelectorAll('table')[3].children[0].children[0].children[0].textContent!.split('：')[2].split('，房价请向客人保密')[0]
	function roomNightSplitter(rateInfoText: string): number[] {
		const rate = Number(rateInfoText.split('晚)')[1].replace(/[^0-9]/gi, ''))
		const nts = parseInt(rateInfoText.split('晚)')[0].split('(')[1])
		return Array(nts).fill(rate)
	}

	let roomRates = []
	if (rateInfoText.includes('，')) {
		// more than one rate
		const rateInfoArray = rateInfoText.split('，')
		roomRates = rateInfoArray.map((rateText) => roomNightSplitter(rateText)).flat()
	} else {
		// single rate
		roomRates = roomNightSplitter(rateInfoText)
	}
	const remarksField = document.querySelectorAll('table')[3].children[0].children[0].children[0] as HTMLElement
	const remarks = remarksField.innerText.split('\n').slice(2).join(', ')

	return {
		identifier: '031709eafc20ab898d6b9e9860d31966',
		agent: 'kingsley',
		payment: '预付',
		orderId,
		roomType,
		roomRates,
		guestNames,
		ciDate,
		coDate,
		roomQty,
		bbf,
		remarks
	}
}

parserMap.set('jielv', Jielv)
function Jielv(): ReservationOTA {
	const tdclass = Array.from(document.querySelectorAll('.tdclass')).map(td => td.nextElementSibling) as HTMLElement[]
	const orderId = tdclass[0].innerText
	const roomType = tdclass[4].innerText.split(' ')[0]
	const guestNames = tdclass[6].innerText.split(',')

	const [ciDate, coDate] = tdclass[7].innerText.split('至')
	const remarks = tdclass[11].innerText

	const tabbles = document.querySelectorAll('.tabble-body')
	const roomQty = parseInt((tabbles[0].children[4] as HTMLElement).innerText)
	const roomRates = []

	const bbfCase: Record<string, 0 | 1 | 2> = {
		"不含早": 0,
		"单早": 1,
		"双早": 2
	}

	let bbf = bbfCase[(tabbles[0].children[1] as HTMLElement).innerText.split(' ')[1]]
	for (const tabble of tabbles) {
		roomRates.push(Number((tabble.children[3] as HTMLElement).innerText.slice(0, -2)))
	}
	roomRates.pop()

	return {
		identifier: '031709eafc20ab898d6b9e9860d31966',
		agent: 'jielv',
		payment: '预付',
		orderId,
		roomType,
		roomRates,
		guestNames,
		ciDate,
		coDate,
		roomQty,
		bbf,
		remarks
	}
}

parserMap.set('ctrip', Ctrip)
const ctripAttributedFields = {
	orderId: "text:OrderID + OrderTypeDisplay",
	name: "html:ClientName",
	cico: "html:ArrivalAndDeparture",
	roomType: "text: RoomName",
	roomQty: "text: Quantity",
	roomRates: "html:RoomPriceText",
	payment: "html: $data.PaymentTermDisplay",
	remarks: "html:CtripRemarks",
	company: "html: CompanyName",
	package: "text:MealOrderInfo.allInfoTitle"
}
function Ctrip() {
	const url = window.location.href

	if (url.includes('SourceType=1')) {
		return ctripOta()
	}

	if (url.includes('SourceType=6')) {
		return ctripBusiness()
	}
}

function ctripOta(): ReservationOTA {
	const attr = 'data-bind'
	const orderId = getElementWithAttribute('label', attr, ctripAttributedFields.orderId)!.innerText.replace(/[^0-9]/ig, "")
	const guestNames = getElementWithAttribute('span', attr, ctripAttributedFields.name)!.innerHTML.split('&')[0].split(',')
	const cicoField = getElementWithAttribute('span', attr, ctripAttributedFields.cico)!.innerText.split(' ')
	const ciDate = cicoField[0].replaceAll('/', '-')
	const coDate = cicoField[2].replaceAll('/', '-')
	const roomNameField = getElementWithAttribute('span', attr, ctripAttributedFields.roomType)!.innerText
	const roomType = roomNameField.split('房')[0] + '房'
	const packages = getElementWithAttribute('span', attr, ctripAttributedFields.package)?.innerText ?? ''
	const roomQty = Number(getElementWithAttribute('b', attr, ctripAttributedFields.roomQty)!.innerText)
	const payment = (roomNameField.includes('商旅尊享') ? "商旅" : "") + getElementWithAttribute('span', attr, ctripAttributedFields.payment)!.innerText
	const remarks = document.getElementById('lblRemark')!.innerText.split('\n').filter(r => r.includes('要求') || r.includes('留言')).join('; ')

	const rateFieldText = getElementWithAttribute('span', attr, ctripAttributedFields.roomRates)!.innerText.split('\n')
	const roomRates = rateFieldText.filter(field => field != '').map(field => Number(field.split(' ')[2].replace('CNY', '')))
	const bbf = rateFieldText[0].includes('不含餐') ? 0 : rateFieldText[0].includes('1 早餐') ? 1 : 2 

	return {
		identifier: '031709eafc20ab898d6b9e9860d31966',
		agent: 'ctrip-ota',
		payment,
		orderId,
		roomType,
		packages,
		roomRates,
		guestNames,
		ciDate,
		coDate,
		roomQty,
		bbf,
		remarks
	}
}

function ctripBusiness(): ReservationOTA {
	const attr = 'data-bind'
	const orderId = getElementWithAttribute('label', attr, ctripAttributedFields.orderId)!.innerText.replace(/[^0-9]/ig, "")
	const company = getElementWithAttribute('span', attr, ctripAttributedFields.company)!.innerText
	const guestNames = getElementWithAttribute('span', attr, ctripAttributedFields.name)!.innerHTML.split('&')[0].split(',')
	const cicoField = getElementWithAttribute('span', attr, ctripAttributedFields.cico)!.innerText.split(' ')[0].split('-')
	const ciDate = cicoField[0].replaceAll('/', '-')
	const coDate = cicoField[1].replaceAll('/', '-')
	const roomType = getElementWithAttribute('span', attr, ctripAttributedFields.roomType)!.innerText.split('房')[0] + '房'
	const roomQty = Number(getElementWithAttribute('b', attr, ctripAttributedFields.roomQty)!.innerText)
	const payment = getElementWithAttribute('span', attr, ctripAttributedFields.payment)!.innerText
	const remarks = document.getElementById('lblRemark')!.innerText.replaceAll('\n', '; ')

	const rateFieldText = getElementWithAttribute('span', attr, ctripAttributedFields.roomRates)!.innerText
	const roomRate = Number(rateFieldText.split('RMB')[1].split('含')[0])
	const roomRates = Array(dateDiffInDays(ciDate, coDate)).fill(roomRate)
	const bbf = rateFieldText.includes('含双早') ? 2 : 1

	return {
		identifier: '031709eafc20ab898d6b9e9860d31966',
		agent: 'ctrip-business',
		company,
		payment,
		orderId,
		roomType,
		roomRates,
		guestNames,
		ciDate,
		coDate,
		roomQty,
		bbf,
		remarks
	}
}

parserMap.set('meituan', Meituan)
async function Meituan(): Promise<ReservationOTA> {
	(document.querySelector('.btn-text') as HTMLSpanElement)?.click()

	const result = new Promise<ReservationOTA>(resolve => {
		const nameField = document.querySelector('.guest-name') as HTMLSpanElement
		const loop = setInterval(() => {
			if (!nameField.innerText.includes('*')) {
				clearInterval(loop)
				const resvInfo: Record<string, any> = {}
				const contents = Array.from(document.querySelectorAll('.info-content')) as HTMLElement[]

				resvInfo.orderId = contents[0].innerText.split(' ')[0]
				resvInfo.guestNames = contents[3].innerText.includes('、') ? contents[3].innerText.split('、') : [contents[3].innerText]
				resvInfo.roomType = contents[5].innerText.split('房')[0] + '房'
				resvInfo.roomQty = parseInt(contents[5].innerText.split(' ').at(-1)!.replace('间', ''))
				const [ciDate, _, coDate] = contents[6].innerText.split(' ')
				resvInfo.ciDate = ciDate
				resvInfo.coDate = coDate
				resvInfo.payment = contents[7].innerText

				const rateInfo = Array.from(contents[9].children) as HTMLElement[]
				resvInfo.roomRates = rateInfo.map(line => parseFloat((line.children[0] as HTMLSpanElement).innerText.replace('￥', '')))
				// resvInfo.bbf = rateInfo.map(line => {
				// 	const breakfastInfo = (line.children[3] as HTMLSpanElement).innerText
				// 	return breakfastInfo === '不含早' ? 0 : breakfastInfo.includes('1') ? 1 : 2
				// })
				const breakfastInfo = (rateInfo[0].children[3] as HTMLSpanElement).innerText
				resvInfo.bbf = breakfastInfo === '不含早' ? 0 : breakfastInfo.includes('1') ? 1 : 2

				const hasPackages = Array.from(document.querySelectorAll('.info-key')).find(span => (span as HTMLElement).innerText.includes('礼包'))
				resvInfo.packages = hasPackages ? filterBracedText((hasPackages.nextElementSibling as HTMLElement).innerText, '【', '】') : ""

				resvInfo.identifier = '031709eafc20ab898d6b9e9860d31966'
				resvInfo.agent = 'meituan'
				resvInfo.remarks = ""

				resolve(resvInfo as ReservationOTA)
			}
		}, 1000)
	})

	return result
}

// util functions
function dateDiffInDays(date1: string, date2: string): number {
	const [year1, month1, day1] = date1.split('-')
	const [year2, month2, day2] = date2.split('-')

	const firstDate = new Date(Number(year1), Number(month1), Number(day1))
	const secondDate = new Date(Number(year2), Number(month2), Number(day2))

	const timeDifference = secondDate.getTime() - firstDate.getTime()

	const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24))

	return daysDifference
}

function getElementWithAttribute(tag: string, attr: string, attrContent: string): HTMLElement | null {
	return document.querySelector(`${tag}[${attr}="${attrContent}"]`)
}

function filterBracedText(text: string, leftBrace: string, rightBrace: string) {
	let isCollecting = false
	let res = ''

	text.split('').forEach((token: string) => {
		if (!isCollecting && token === leftBrace) {
			isCollecting = true
		} else if (isCollecting && token === rightBrace) {
			res += ','
			isCollecting = false
		} else {
			if (isCollecting) res += token
		}
	})

	return res.split(',').slice(0, -1).join(',')
}