export const agentSrcDefault = [
	{ agent: 'jielv', name: '深圳捷旅', domain: 'ebooking.jladmin.cn' },
	{ agent: 'kingsley', name: '广州奇利', domain: 'ql-gz.com/ebooking' },
	// { agent: 'ctrip', name: '携程酒店', domain: 'ebooking.ctrip.com' },
	// { agent: 'meituan', name: '美团酒店', domain: 'eb.meituan.com' },
	// { agent: 'fliggy', name: '飞猪旅行', domain: 'hotel.fliggy.com' },
	{ agent: 'email', name: 'FedEx 邮件', domain: 'mail.qiye.163.com' },
	// { agentName: '微信商城', domain: 'ebooking.jladmin.cn' },
]

export type Agents = {
	agent: string
	name: string
	domain: string
}[]

export type DeepSeek = {
	key: string,
	model: string
}

export type ReservationOTA = {
	identifier: string
	agent: string
	payment: string
	orderId: string
	roomType: string
	roomRates: string | number[]
	guestNames: string | string[]
	ciDate: string
	coDate: string
	roomQty: string | number
	bbf: string | number[]
	remarks: string
}

export type ReservationFedex = {
	identifier: string
	agent: string
	resvType: string,
	crewNames: string[] | string,
	roomQty: number | string,
	ciDate: string,
	flightIn: string,
	ETA: string,
	flightOut: string,
	coDate: string,
	ETD: string,
	stayHours: string,
	daysActual: number | string,
	roomRates: string | number[],
	tripNum: string,
	tracking: string
}

