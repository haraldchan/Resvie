import { Accessor, Setter } from 'solid-js'
import { ReservationOTA } from '@/models/models'

type Props = {
	otaInfo: Accessor<ReservationOTA | null>
	setOtaInfo: Setter<ReservationOTA | null>
	copyToClipboard: (param: string) => void
}

export default function ReservationFormOTA({ otaInfo, setOtaInfo, copyToClipboard }: Props) {
	function handleFormFormating(e: Event) {
		e.preventDefault()
		const target = e.type === 'submit' ? (e.target as HTMLFormElement) : (e.target as HTMLInputElement)
		const form = target.tagName === 'form' ? target : target.form
		const formData = new FormData(form)

		const updatedResvInfo = otaInfo() as ReservationOTA
		for (const [key, value] of formData) {
			if (key === 'bbf' || key === 'roomRates') {
				updatedResvInfo[key] = value
					.toString()
					.split(',')
					.map((r) => Number(r))
			} else if (key === 'guestNames') {
				updatedResvInfo[key] = value.toString().split(',')
			} else if (key === 'roomQty') {
				updatedResvInfo[key] === Number(value.toString())
			} else {
				switch (key) {
					case 'orderId':
					case 'ciDate':
					case 'coDate':
					case 'remarks':
					case 'roomType':
						updatedResvInfo[key] = value.toString()
				}
			}
		}

		const ciDate = new Date(updatedResvInfo.ciDate)
		const coDate = new Date(updatedResvInfo.coDate)
		const dateDiffInDays = (coDate.getTime() - ciDate.getTime()) / (1000 * 60 * 60 * 24)

		if (target.name === 'ciDate') {
			updatedResvInfo.roomRates = Array(dateDiffInDays).fill(otaInfo()?.roomRates[0])
			updatedResvInfo.bbf = Array(dateDiffInDays).fill(otaInfo()?.bbf[0])
		}

		if (target.name === 'coDate') {
			updatedResvInfo.roomRates = Array(dateDiffInDays).fill(otaInfo()?.roomRates[0])
			updatedResvInfo.bbf = Array(dateDiffInDays).fill(otaInfo()?.bbf[0])
		}

		console.log(updatedResvInfo)
		setOtaInfo(null)
		setOtaInfo(updatedResvInfo)
		copyToClipboard(JSON.stringify(updatedResvInfo))
	}

	return (
		<form onSubmit={handleFormFormating}>
			<header class='form-title'>订单详情</header>
			<div class='form-row'>
				<label>
					<span class='form-label'>订单号码</span>
					<input
						class='form-input'
						name='orderId'
						type='text'
						value={otaInfo()?.orderId}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>住客姓名</span>
					<input
						class='form-input'
						name='guestNames'
						type='text'
						value={otaInfo()?.guestNames}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>房间类型</span>
					<input
						class='form-input'
						name='roomType'
						type='text'
						value={otaInfo()?.roomType}
						on:blur={handleFormFormating}
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
						value={otaInfo()?.roomQty}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>入住日期</span>
					<input
						class='form-input'
						name='ciDate'
						type='date'
						value={otaInfo()?.ciDate}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>退房日期</span>
					<input
						class='form-input'
						name='coDate'
						type='date'
						value={otaInfo()?.coDate}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>房价构成</span>
					<input
						class='form-input'
						name='roomRates'
						type='text'
						value={otaInfo()?.roomRates.toString()}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>含早情况</span>
					<input
						class='form-input'
						name='bbf'
						type='text'
						value={otaInfo()?.bbf.toString()}
						on:blur={handleFormFormating}
					/>
				</label>
			</div>
			<div class='form-row'>
				<label>
					<span class='form-label'>其他备注</span>
					<input
						class='form-input'
						name='remarks'
						type='text'
						value={otaInfo()?.remarks}
						on:blur={handleFormFormating}
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
	)
}
