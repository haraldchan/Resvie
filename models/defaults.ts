import { Prompts } from './models'

export const defaultAgentSrc = [
    { agent: 'jielv', name: '深圳捷旅', domain: 'ebooking.jladmin.cn', urlKeyword: 'print' },
    { agent: 'kingsley', name: '广州奇利', domain: 'ql-gz.com/ebooking', urlKeyword: 'THotelOrderformShowDpAct' },
    { agent: 'ctrip', name: '携程酒店', domain: 'ebooking.ctrip.com', urlKeyword: 'print' },
    // { agent: 'meituan', name: '美团酒店', domain: 'eb.meituan.com', urlKeyword: 'print' },
    // { agent: 'fliggy', name: '飞猪旅行', domain: 'hotel.fliggy.com', urlKeyword: 'print' },
    { agent: 'email', name: 'FedEx 邮件', domain: 'mail.qiye.163.com',urlKeyword: 'readhtml' }
]

export const defaultFedexSystemPrompt = `<role>
You are an expert HTML-to-JSON converter, fulfill the requirement and follow the schema and description strictly.
</role>

<requirement>
Extract reservation data from HTML into JSON. if New Resv table line exist, always use this line
</requiement>

<schema>
{              
    identifier: '031709eafc20ab898d6b9e9860d31966', 
    agent: 'fedex',           
    resvType: "ADD"|"CHANGE", <- if "ADD HOTEL RESERVATION" then ADD, otherwise CHANGE
    roomQty: number,          <- from col "Rooms"
    flightIn: string,         <- from col "Inbd Flight", no spaces in between
    flightOut: string,        < from col "Outbd Flight", no spaces in between
    ciDate: string,           <- yyyy-MM-dd
    ETA: string,              <- convert to HH:mm 24 Hours e.g. 12:00 AM=00:00, 12:00 PM=12:00
    coDate: string,           <- yyyy-MM-dd
    ETD: string,              <- convert to HH:mm 24 Hours e.g. 12:00 AM=00:00, 12:00 PM=12:00
    stayHours: string,        <- calculate by diffing ciDate+ETA and coDate+ETD, format it as "HH:MM"
    daysActual: number,       <- count each 24h as a day, if exceeded minutes and not 24h yet, count it as a day, e.g. 24:12 = 2
    roomRates: number[],      <- from daily rate*1.15, toFixed(2), length should be the same with daysActual
    crewNames: string[],      <- only names, no title & staff ids
    tripNum: string,          <- from Trip#, 58 OAK 67 02Jun25 <- 58/67
    tracking: string          <- from Tracking # 
}
</schema>

<rules>
  1. Dates must be in yyyy-MM-dd format.
  2. Convert time to HH:mm 24 Hours e.g. 12:00AM=00:00, 12:00PM=12:00
  3. Return null for missing fields.
</rules>`

export const defaultFedexUserPrompt = ''

export const defaultOtaSystemPrompt = `<role>
You are an expert HTML-to-JSON converter, fulfill the requirement and follow the schema and description strictly.
</role>

<requirement>
Extract reservation data from HTML into JSON.
</requiement>

<schema>
{        
    identifier: '031709eafc20ab898d6b9e9860d31966',
    agent: {{agent}},       
    orderId: string,      <- from '订单号'
    guestNames: string[], <- from '客人/客人姓名'
    roomType: string,     <- extracted from '房/类型' ends with '房'
    roomQty: number,      <- look for how many rooms reserved
    ciDate: "yyyy-MM-dd", <- extracted from 入/入住/日期
    coDate: "yyyy-MM-dd", <- extracted from 离/退/退房/日期
    roomRates: number[],  <- extracted from 房价 related fields
    bbf: number[]         <- when no breakfast, just return [0], length=staying nights
    remarks: string       <- if 要求/房型产品/备注/remarks exists, return it here, replace linebreaks with comma
}
</schema>`

export const defaultOtaUserPrompt = `<context>

</context>
`

export const defaultPrompts: Prompts = defaultAgentSrc.map(agent => {
    return {
        agent: agent.agent,
        name: agent.name,
        prompt: agent.name === 'FedEx 邮件' 
            ? { system: defaultFedexSystemPrompt, user: defaultFedexUserPrompt } 
            : { system: defaultOtaSystemPrompt, user: defaultFedexUserPrompt } 
    }
})