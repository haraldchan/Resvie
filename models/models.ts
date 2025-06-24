export type Agents = {
	agent: string
	name: string
	domain: string,
	urlKeyword: string
}[]

export type Prompts = {
	agent: string
	name: string
	prompt: {
		system: string
		user: string
	}
}[]

export type DeepSeek = {
	key: string,
	model: string
}

export type ReservationOTA = {
	identifier: string
	agent: string
	company?: string
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

