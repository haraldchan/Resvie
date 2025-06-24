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
	const bbfCount = orderIdText.includes('不含早') ? 0 : orderIdText.includes('单早') ? 1 : 2

	const stayTable = document.querySelectorAll('table')[2].children[0]
	const ciDate = stayTable.children[1].children[0].textContent!.trim().replace(/[^0-9]/gi, '-').slice(0, 10)
	const coDate = stayTable.children[stayTable.childElementCount - 1].children[1].textContent!.trim().replace(/[^0-9]/gi, '-').slice(0, 10)
	const bbf = Array(dateDiffInDays(ciDate, coDate)).fill(bbfCount)
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
	const remarks = document.querySelectorAll('table')[3].children[0].children[0].children[0].textContent!.split('：')[2].split('，房价请向客人保密。')[1]

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
	const bbf = []
	for (const tabble of tabbles) {
		roomRates.push(Number((tabble.children[3] as HTMLElement).innerText.slice(0, -2)))
		const breakfast = (tabble.children[1] as HTMLElement).innerText.split(' ')[1]
		bbf.push(breakfast === '不含早' ? 0 : breakfast === '单早' ? 1 : 2)
	}
	roomRates.pop()
	bbf.pop()

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
	company: "html: CompanyName"
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
	const roomType = getElementWithAttribute('span', attr, ctripAttributedFields.roomType)!.innerText.split('房')[0] + '房'
	const roomQty = Number(getElementWithAttribute('b', attr, ctripAttributedFields.roomQty)!.innerText)
	const payment = getElementWithAttribute('span', attr, ctripAttributedFields.payment)!.innerText
	const remarks = document.getElementById('lblRemark')!.innerText.replaceAll('\n', '; ')

	const rateFieldText = getElementWithAttribute('span', attr, ctripAttributedFields.roomRates)!.innerText.split('\n')
	const roomRates = rateFieldText.filter(field => field != '').map(field => Number(field.split(' ')[2].replace('CNY', '')))
	const bbf = rateFieldText.filter(field => field != '').map(field => field.includes('不含餐') ? 0 : Number(field.split(' ')[3]))

	return {
		identifier: '031709eafc20ab898d6b9e9860d31966',
		agent: 'ctrip-ota',
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

function ctripBusiness() {
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
	const bbf = Array(dateDiffInDays(ciDate, coDate)).fill(rateFieldText.includes('含双早') ? 2 : 1)

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
function Meituan() {
	const infoObj: Partial<ReservationOTA> = {
		identifier: '031709eafc20ab898d6b9e9860d31966',
		agent: 'metuan',
	}
	const infoItems = document.querySelectorAll('.detail-info-item')
	infoObj.orderId = (infoItems[0].children[1] as HTMLElement).innerText.split(' ')[0]

	const guestNames = (infoItems[3] as HTMLElement).innerText.split('\n')[1]
	if (guestNames.includes('、')) {
		infoObj.guestNames = guestNames.split('、')
	} else {
		infoObj.guestNames = [guestNames]
	}

	const roomCharIndex = (infoItems[5] as HTMLElement).innerText.split('\n')[1].indexOf('房')
	infoObj.roomType = (infoItems[5] as HTMLElement).innerText.split('\n')[1].slice(0, roomCharIndex + 1)
	infoObj.roomQty = Number((infoItems[5].children[1].children[0] as HTMLElement).innerText.slice(0, 1))

	const stay = infoItems[6].children[1].childNodes[0].nodeValue as string
	infoObj.ciDate = stay.split('至')[0].trim()
	infoObj.coDate = stay.split('至')[1].trim()

	const roomRates = []
	const roomRateNodeList = document.querySelectorAll('.detail-info-wrap .text-danger')
	for (const rate of roomRateNodeList) {
		roomRates.push(Number((rate as HTMLElement).innerText.slice(1))).toFixed(2)
	}

	roomRates.shift()
	infoObj.roomRates = roomRates

	const bbf = []
	const bbfNodeList = document.querySelectorAll('.detail-info-wrap .ml-20')
	for (const breakfast of bbfNodeList) {

		if ((breakfast as HTMLElement).innerText === '不含早') {
			bbf.push(0)
		} else if ((breakfast as HTMLElement).innerText === '单早') {
			bbf.push(1)
		} else {
			bbf.push(2)
		}
	}
	infoObj.bbf = bbf

	return infoObj
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