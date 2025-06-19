import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { DeepSeek, ReservationFedex, ReservationOTA } from '@/models/models'

type ParseResult =
    | { success: true; data: ReservationOTA | ReservationFedex }
    | { success: false; data: string }

function quickClean(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/\s*style="[^"]*"/gi, '') // remove inline style
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/[\t\r\n]+/g, '')
        .trim()
}

const serializer = new XMLSerializer()
function setMessage(agent: string, content: string): ChatCompletionMessageParam[] {

    return agent === 'fedex'
        ? [
            {
                role: 'system',
                content: `
                You are an expert HTML-to-JSON converter. Strictly follow these rules:
                1. Extract reservation data from HTML into JSON. if New Resv table line exist, always use this line
                2. Use this schema:
                {              
                    identifier: '031709eafc20ab898d6b9e9860d31966', <- fixed
                    agent: ${agent}, <- fixed
                    resvType: "ADD"|"CHANGE", <- if "ADD HOTEL RESERVATION" then ADD, otherwise CHANGE
                    roomQty: number, <- from col "Rooms"
                    flightIn: string, <- from col "Inbd Flight", no spaces in between
                    flightOut: string, from col "Outbd Flight", no spaces in between
                    ciDate: string,
                    ETA: string,
                    coDate: string,
                    ETD: string,
                    stayHours: string, <- calculate by diffing check-in and check-out time, format it as "HH:MM"
                    daysActual: number, <- count each 24h as a day, if exceeded minutes and not 24h yet, count it as a day, example: 24:12 = 2
                    roomRates: number[], <- from daily rate*1.15, toFixed(2), length should be the same with daysActual
                    crewNames: string[], <- only names, no title & staff ids
                    tripNum: string, <- from Trip#, 58 OAK 67 02Jun25 <- 58/67
                    tracking: string <- fromTracking # 
                }
                3. Convert dates to yyyy-MM-dd, times should be HH:mm without meridian.
            `
            },
            {
                role: 'user',
                content: `${content}`
            }
        ] : [
            {
                role: 'system',
                content: `
                You are an expert HTML-to-JSON converter. Strictly follow these rules:
                1. Extract reservation data from HTML into JSON.
                2. Use this schema:
                {        
                    identifier: '031709eafc20ab898d6b9e9860d31966', <- fixed
                    agent: , <- fixed
                    orderId: number, <- extracted from '订单号'
                    guestNames: string[], <- extracted from '客人/客人姓名'
                    roomType: string, <-  extracted from '房/类型'never return character after '房'
                    roomQty: number, <- look for how many rooms reserved
                    ciDate: "yyyy-MM-dd", <- extracted from 入/入住/日期
                    coDate: "yyyy-MM-dd", <- extracted from 离/退/退房/日期
                    roomRates: number[], <- extracted from 房价 related fields
                    bbf: number[] <- when no breakfast, just return [0]
                    remarks: string <- if 要求/房型产品/备注/remarks  exists, return it here.
                }
            `
            },
            {
                role: 'user',
                content: `${content}`
            }
        ]
}

export default async function parseReservationByDeepSeek(agent: string): Promise<ParseResult> {
    const deepseek: DeepSeek = await storage.getItem('local:deepseek') ?? { key: '', model: 'deepseek-chat' }
    if (!deepseek.key) {
        return { success: false, data: 'No API' }
    }

    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: deepseek.key,
        dangerouslyAllowBrowser: true
    })

    const messages = setMessage(agent, quickClean(serializer.serializeToString(document.body)))

    try {
        const response = await openai.chat.completions.create({
            messages: messages,
            model: deepseek.model,
            response_format: { type: 'json_object' }
        })

        const jsonString = response.choices[0].message.content
        const data = JSON.parse(jsonString!) as ReservationOTA
        return { success: true, data }
    } catch (err) {
        return {
            success: false,
            data: err instanceof Error ? err.message : "Failed to parse reservation"
        }
    }
}