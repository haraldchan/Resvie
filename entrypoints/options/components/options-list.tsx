import { Options } from '../Options'
import { Accessor, Setter } from 'solid-js'

type Props = {
    selectedOption: Accessor<Options>
	setSelectedOptions: Setter<Options>
}

export default function OptionList({ selectedOption, setSelectedOptions }: Props) {
    function getText(e: Event) {
        e.preventDefault()
        setSelectedOptions((e.target as HTMLLIElement).innerText as Options)
    }

	return (
		<ul class='option-list-items'>
			<li onclick={getText} class={selectedOption() === '大模型设置' ? 'li-clicked' : ''}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='15px'
					height='15px'
				>
					<g
						fill='none'
						stroke='currentColor'
						stroke-linecapinecap='round'
						stroke-linejoin='round'
						stroke-width='1.5'
						color='currentColor'
					>
						<path d='M4 16.5a3 3 0 0 0 3 3a2.5 2.5 0 0 0 5 0a2.5 2.5 0 1 0 5 0a3 3 0 0 0 2.567-4.553a3.001 3.001 0 0 0 0-5.893A3 3 0 0 0 17 4.5a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0-5 0a3 3 0 0 0-2.567 4.553a3.001 3.001 0 0 0 0 5.893A3 3 0 0 0 4 16.5'></path>
						<path d='m7.5 14.5l1.842-5.526a.694.694 0 0 1 1.316 0L12.5 14.5m3-6v6m-7-2h3'></path>
					</g>
				</svg>
				大模型设置
			</li>
			<li onclick={getText}  class={selectedOption() === 'OTA 网址配置' ? 'li-clicked' : ''}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 2048 2048'
					width='15px'
					height='15px'
				>
					<path
						fill='currentColor'
						d='M960 768q93 0 174 35t142 96t96 142t36 175q0 93-35 174t-96 142t-142 96t-175 36q-93 0-174-35t-142-96t-96-142t-36-175q0-93 35-174t96-142t142-96t175-36m346 384q-15-80-63-145t-120-103q29 58 42 121t17 127zm-221 128H834q1 16 4 44t10 60t17 64t24 59t31 44t40 17q21 0 38-17t30-44t24-60t17-65t11-59t5-43m-251-128h252q-1-15-5-42t-11-59t-17-65t-24-60t-31-45t-38-17q-22 0-39 17t-31 44t-24 60t-17 65t-10 59t-5 43m-41-246q-35 19-64 45t-53 57t-39 68t-23 76h124q4-63 16-125t39-121m-179 374q14 78 61 142t116 103q-26-57-37-119t-16-126zm510 248q71-38 119-103t63-145h-124q-5 63-18 126t-40 122M1115 0l549 549v1371H256V0zm37 219v293h293zM384 1792h1152V640h-512V128H384z'
					></path>
				</svg>
				OTA 网址配置
			</li>
		</ul>
	)
}
