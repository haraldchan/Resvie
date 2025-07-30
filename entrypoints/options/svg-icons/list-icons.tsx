type Props = {
	viewBox?: string
	width?: string
	height?: string
	fill?: string
	color?: string
}

export function OtaIcon({ viewBox, width, height, fill }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 2048 2048'}
			width={width || '15px'}
			height={height || '15px'}
		>
			<path
				fill={fill || 'currentColor'}
				d='M960 768q93 0 174 35t142 96t96 142t36 175q0 93-35 174t-96 142t-142 96t-175 36q-93 0-174-35t-142-96t-96-142t-36-175q0-93 35-174t96-142t142-96t175-36m346 384q-15-80-63-145t-120-103q29 58 42 121t17 127zm-221 128H834q1 16 4 44t10 60t17 64t24 59t31 44t40 17q21 0 38-17t30-44t24-60t17-65t11-59t5-43m-251-128h252q-1-15-5-42t-11-59t-17-65t-24-60t-31-45t-38-17q-22 0-39 17t-31 44t-24 60t-17 65t-10 59t-5 43m-41-246q-35 19-64 45t-53 57t-39 68t-23 76h124q4-63 16-125t39-121m-179 374q14 78 61 142t116 103q-26-57-37-119t-16-126zm510 248q71-38 119-103t63-145h-124q-5 63-18 126t-40 122M1115 0l549 549v1371H256V0zm37 219v293h293zM384 1792h1152V640h-512V128H384z'
			></path>
		</svg>
	)
}

export function ModelIcon({ viewBox, width, height, fill, color }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 24 24'}
			width={width || '15px'}
			height={height || '15px'}
		>
			<g
				fill={fill || 'none'}
				stroke='currentColor'
				stroke-linecapinecap='round'
				stroke-linejoin='round'
				stroke-width='1.5'
				color={color || 'cuurentColor'}
			>
				<path d='M4 16.5a3 3 0 0 0 3 3a2.5 2.5 0 0 0 5 0a2.5 2.5 0 1 0 5 0a3 3 0 0 0 2.567-4.553a3.001 3.001 0 0 0 0-5.893A3 3 0 0 0 17 4.5a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0-5 0a3 3 0 0 0-2.567 4.553a3.001 3.001 0 0 0 0 5.893A3 3 0 0 0 4 16.5'></path>
				<path d='m7.5 14.5l1.842-5.526a.694.694 0 0 1 1.316 0L12.5 14.5m3-6v6m-7-2h3'></path>
			</g>
		</svg>
	)
}

export function PromptIcon({ viewBox, width, height, fill, color }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 24 24'}
			width={width || '15px'}
			height={height || '15px'}
		>
			<path
				fill={fill || 'none'}
				stroke='currentColor'
				// strokeLinecap='round'
				// strokeLinejoin='round'
				d='M19.326 5.778C20 6.787 20 8.19 20 11s0 4.213-.674 5.222a4 4 0 0 1-1.104 1.104c-.881.589-2.064.663-4.222.673V18l-1.106 2.211a1 1 0 0 1-1.788 0L10 18v-.001c-2.158-.01-3.34-.084-4.222-.673a4 4 0 0 1-1.104-1.104C4 15.213 4 13.81 4 11s0-4.213.674-5.222a4 4 0 0 1 1.104-1.104C6.787 4 8.19 4 11 4h2c2.809 0 4.213 0 5.222.674a4 4 0 0 1 1.104 1.104M9 9h6m-6 4h3'
			></path>
		</svg>
	)
}
