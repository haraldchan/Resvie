// parsers
import parserMap from '@/parsers/ota-parsers'
import parseReservationByDeepSeek from '@/parsers/ds-parser'
import FedexMail from '@/parsers/fedex-parsers'
// models and defaults
import { Agents, ReservationFedex, ReservationOTA } from '@/models/models'
import { defaultAgentSrc } from '@/models/defaults'
// components
import CollapseButton from './components/collapse-button'
import ReservationFormOTA from './components/reservation-form-ota'
import ReservationFormFedex from './components/reservation-form-fedex'
import { Puff } from 'solid-spinner'

export type ModalState = 'hide' | 'parsing' | 'expanded' | 'error'

export default function App() {
	const [isReadablePage, setIsReadablePage] = createSignal(false)
	const [modalState, setModalState] = createSignal<ModalState>('hide')
	const [otaInfo, setOtaInfo] = createSignal<ReservationOTA | null>(null)
	const [fedexInfo, setFedexInfo] = createSignal<ReservationFedex | null>(null)
	const [error, setError] = createSignal('')

	async function handleModalCollapse() {
		const isValid = await validatePage()
		if (!isValid) return

		setModalState((cur) => {
			if (error()) {
				return cur === 'hide' ? 'error' : 'hide'
			} else {
				return cur === 'hide' ? 'expanded' : 'hide'
			}
		})
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text)
			console.log('using navigator')
		} catch {
			console.log('using text-area')
			const textarea = document.createElement('textarea')
			textarea.value = text
			document.body.appendChild(textarea)
			textarea.select()

			try {
				const success = document.execCommand('copy')
				if (success) console.log('Copied!')
				else console.error('Copy failed')
			} catch (err) {
				console.error('Copy error:', err)
			} finally {
				document.body.removeChild(textarea)
			}
		}
	}

	async function validatePage() {
		const agentSrc: Agents = (await storage.getItem('local:agentSrc')) ?? defaultAgentSrc
		const url = window.location.href
		const curAgent = agentSrc.find((agent) => {
			// url.includes(agent.domain) && url.toLowerCase().includes(agent.keyword.url.toLowerCase())
			if (!url.includes(agent.domain)) return 

			if (!url.toLowerCase().includes(agent.keyword.url.toLowerCase())) return

			if (agent.keyword.hasOwnProperty('document') && agent.keyword.document !== undefined) {
				if (!document.body.innerText.includes(agent.keyword.document)) return
			}

			return true
		})?.agent
		if (curAgent === undefined) {
			setIsReadablePage(false)
			return
		}

		setIsReadablePage(true)
		return curAgent
	}

	async function getInfoOTA(curAgent: string) {
		try {
			let res = (await parserMap.get(curAgent)?.()) as ReservationOTA

			if (!res) {
				const parsed = await parseReservationByDeepSeek(curAgent)
				if (parsed.success) {
					return parsed.data as ReservationOTA
				} else {
					setModalState('error')
					setError(parsed.data === 'No API' ? '订单获取失败; 未设置 API' : parsed.data)
					return null
				}
			} else {
				return res
			}
		} catch (err) {
			console.log(err)

			const parsed = await parseReservationByDeepSeek(curAgent)
			if (parsed.success) {
				return parsed.data as ReservationOTA
			} else {
				setModalState('error')
				setError(parsed.data === 'No API' ? '订单获取失败; 未设置 API' : parsed.data)
				return null
			}
		} finally {
			if (error() === '') {
				setModalState('expanded')
			}
		}
	}

	async function getInfoFedex() {
		try {
			return FedexMail() as ReservationFedex
		} catch (err) {
			console.log(err)
			// using ds
			setModalState('parsing')

			const parsed = await parseReservationByDeepSeek('fedex')
			if (parsed.success) {
				return parsed.data as ReservationFedex
			} else {
				setModalState('error')
				setError(parsed.data === 'No API' ? '订单获取失败; 未设置 API' : parsed.data)
				return null
			}
		} finally {
			if (error() === '') {
				setModalState('expanded')
			}
		}
	}

	async function parsePage() {
		const curAgent = await validatePage()
		if (!curAgent) return

		const mediaQueryList = window.matchMedia('print')
		mediaQueryList.addEventListener('change', function loadOnPrint(mql) {
			if (mql.matches) {
				window.onafterprint = async () => {
					const res = await getInfoOTA(curAgent)
					setOtaInfo(res)
					setFedexInfo(null)
					console.log(res)
					await copyToClipboard(JSON.stringify(res))
					window.onafterprint = () => 'cleared'
				}

				mediaQueryList.removeEventListener('change', loadOnPrint)
			}
		})

		setModalState('parsing')

		if (curAgent === 'fedex') {
			const res = await getInfoFedex()
			setFedexInfo(res)
			setOtaInfo(null)
			await copyToClipboard(JSON.stringify(res))
		} else {
			if (curAgent !== 'jielv' && curAgent !== 'kingsley') {
				await new Promise((r) => setTimeout(r, 2000))
			}

			if (window.onafterprint === null) {
				const res = await getInfoOTA(curAgent)
				setOtaInfo(res)
				setFedexInfo(null)
				console.log(res)
				await copyToClipboard(JSON.stringify(res))
			}
		}
	}

	onMount(parsePage)

	return (
		<div
			style={{ display: isReadablePage() ? 'block' : 'none' }}
			classList={{
				'rh-modal': true,
				'border-gradient': true,
				'border-gradient-color': true,
				hide: modalState() === 'hide',
				parsing: modalState() === 'parsing',
				error: modalState() === 'error',
				'expanded-ota': modalState() === 'expanded' && otaInfo() !== null,
				'expanded-fedex': modalState() === 'expanded' && fedexInfo() !== null,
			}}
		>
			<CollapseButton
				modalState={modalState}
				collapse={handleModalCollapse}
			/>
			<Show when={modalState() === 'parsing'}>
				<Puff />
			</Show>
			<Show when={modalState() === 'error'}>
				<p>Error : {error()}</p>
			</Show>
			<Show when={otaInfo() && modalState() === 'expanded'}>
				<ReservationFormOTA
					otaInfo={otaInfo}
					setOtaInfo={setOtaInfo}
					parsePage={parsePage}
					copyToClipboard={copyToClipboard}
				/>
			</Show>
			<Show when={fedexInfo() && modalState() === 'expanded'}>
				<ReservationFormFedex
					fedexInfo={fedexInfo}
					setFedexInfo={setFedexInfo}
					copyToClipboard={copyToClipboard}
				/>
			</Show>
		</div>
	)
}
