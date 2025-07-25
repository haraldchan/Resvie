import { Accessor, Setter } from 'solid-js'
import { ReservationFedex } from '@/models/models'
import { getStayHours, getDaysActual } from '@/parsers/fedex-parsers'

type Props = {
	fedexInfo: Accessor<ReservationFedex | null>
	setFedexInfo: Setter<ReservationFedex | null>
	copyToClipboard: (param: string) => void
}

export default function ReservationFormFedex({ fedexInfo, setFedexInfo, copyToClipboard }: Props) {
	async function handleFormFormating(e: Event) {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)

		const updatedResvInfo = fedexInfo() as ReservationFedex
		for (const [key, value] of formData) {
			if (key === 'crewNames') {
				updatedResvInfo[key] = value
					.toString()
					.split(',')
					.map((crew) => crew.trim())
			} else {
				switch (key) {
					case 'resvType':
					case 'tripNum':
					case 'flightIn':
					case 'ciDate':
					case 'ETA':
					case 'flightOut':
					case 'coDate':
					case 'ETD':
					case 'stayHours':
					case 'tracking':
						updatedResvInfo[key] = value.toString()
				}
			}
		}

		updatedResvInfo.stayHours = getStayHours(updatedResvInfo.ciDate, updatedResvInfo.ETA, updatedResvInfo.coDate, updatedResvInfo.ETD)
		updatedResvInfo.daysActual = getDaysActual(updatedResvInfo.stayHours) as number
		updatedResvInfo.roomRates = Array(updatedResvInfo.daysActual).fill(fedexInfo()?.roomRates[0])

		console.log(updatedResvInfo)
		setFedexInfo(null)
		setFedexInfo(updatedResvInfo)
		copyToClipboard(JSON.stringify(updatedResvInfo))
	}

	onMount(() => {
		const updated = fedexInfo() as ReservationFedex
		if (updated !== null) {
			updated.stayHours = getStayHours(updated.ciDate, updated.ETA, updated.coDate, updated.ETD)
			updated.daysActual = getDaysActual(updated.stayHours) as number
			updated.roomRates = Array(updated.daysActual).fill(fedexInfo()?.roomRates[0])

			setFedexInfo(null)
			setFedexInfo(updated)
		}
	})

	return (
		<>
			<header class='form-title'>
				<img
					height='50px'
					src={browser.runtime.getURL('/fedex-logo.png')}
					alt='Fedex Logo'
				/>
			</header>
			<form onSubmit={handleFormFormating}>
				<div class='form-row'>
					<label>
						<span class='form-label'>订单类型</span>
						<input
							class='form-input'
							name='resvType'
							type='text'
							value={fedexInfo()?.resvType}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>Trip No.</span>
						<input
							class='form-input'
							name='tripNum'
							type='text'
							value={fedexInfo()?.tripNum}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>机组姓名</span>
						<input
							class='form-input'
							name='crewNames'
							type='text'
							value={fedexInfo()?.crewNames}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>房间数量</span>
						<input
							class='form-input'
							name='roomQty'
							type='text'
							value={fedexInfo()?.roomQty}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>预抵航班</span>
						<input
							class='form-input'
							name='flightIn'
							type='text'
							value={fedexInfo()?.flightIn}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>入住时间</span>
						<input
							style={{ width: '160px' }}
							class='form-input'
							name='ciDate'
							type='date'
							value={fedexInfo()?.ciDate}
						/>
						<input
							style={{ width: '100px' }}
							class='form-input'
							name='ETA'
							type='time'
							value={fedexInfo()?.ETA}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>离开航班</span>
						<input
							class='form-input'
							name='flightOut'
							type='text'
							value={fedexInfo()?.flightOut}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>退房时间</span>
						<input
							style={{ width: '160px' }}
							class='form-input'
							name='coDate'
							type='date'
							value={fedexInfo()?.coDate}
						/>
						<input
							style={{ width: '100px' }}
							class='form-input'
							name='ETD'
							type='time'
							value={fedexInfo()?.ETD}
						/>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>在住时长</span>
						<input
							readonly
							style={{ width: '160px' }}
							class='form-input'
							name='stayHours'
							type='text'
							value={fedexInfo()?.stayHours}
						/>
						<input
							readonly
							style={{ width: '75px' }}
							class='form-input'
							name='daysActual'
							type='text'
							value={fedexInfo()?.daysActual}
						/>
						<span class='form-label'>天</span>
					</label>
				</div>
				<div class='form-row'>
					<label>
						<span class='form-label'>Tracking</span>
						<input
							class='form-input'
							name='tracking'
							type='text'
							value={fedexInfo()?.tracking}
						/>
					</label>
				</div>
				<button
					class='form-button'
					type='submit'
				>
					确 定 修 改
				</button>
			</form>
		</>
	)
}
