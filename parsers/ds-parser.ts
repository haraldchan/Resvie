import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { DeepSeek, Prompts, ReservationFedex, ReservationOTA } from '@/models/models'
import { defaultPrompts } from '@/models/defaults'

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
async function setMessage(agent: string, html: string): Promise<ChatCompletionMessageParam[]> {
    const prompts = await storage.getItem<Prompts>('local:prompts') ?? defaultPrompts

    return agent === 'fedex'
        ? [
            {
                role: 'system',
                content: prompts.find(item => item.agent === 'email')?.prompt.system ?? defaultPrompts.find(item => item.name === 'FedEx 邮件')!.prompt.system
            },
            {
                role: 'user',
                content: `${html}`
            }
        ] : [
            {
                role: 'system',
                content: prompts.find(item => item.agent === agent)?.prompt.system ?? defaultPrompts.find(item => item.agent === 'jielv')!.prompt.system
            },
            {
                role: 'user',
                content: `
                    <user>${prompts.find(item => item.agent === agent)?.prompt.user ?? defaultPrompts.find(item => item.agent === 'jielv')!.prompt.user}</user>
                    <variable>agent=${agent.replace('custom-', '')}</variable>
                    <html>${html}</html>
                `
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

    const messages = await setMessage(agent, quickClean(serializer.serializeToString(document.body)))

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