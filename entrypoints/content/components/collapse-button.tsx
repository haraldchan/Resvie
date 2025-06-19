import { Accessor } from 'solid-js'
import { ModalState } from '../App'

type Props = {
	modalState: Accessor<ModalState>
	collapse: () => void
}

export default function CollapseButton({ modalState, collapse }: Props) {
	return (
		<>
			<button
				style={
					modalState() === 'parsing'
						? { display: 'none' }
						: modalState() === 'hide'
						? { border: 'none', background: 'none', 'z-index': 9999999 }
						: {
								border: 'none',
								background: 'none',
								position: 'absolute',
								top: '5px',
								right: '2px',
								'z-index': 9999999,
						  }
				}
				onclick={collapse}
			>
				<Show when={modalState() === 'hide'}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='5em'
						height='5em'
					>
						<path
							fill='darkgray'
							d='M5 19v-6h2v4h4v2zm12-8V7h-4V5h6v6z'
						></path>
					</svg>
				</Show>
				<Show when={modalState() === 'expanded' || modalState() === 'error'}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='3em'
						height='3em'
					>
						<path
							fill='darkgray'
							d='M11 13v6H9v-4H5v-2zm4-8v4h4v2h-6V5z'
						></path>
					</svg>
				</Show>
			</button>
			<Show when={modalState() === 'error'}>
				<button
					style={{
						border: 'none',
						background: 'none',
						position: 'absolute',
						bottom: '5px',
						right: '2px',
						'z-index': 9999999,
					}}
					onclick={() => window.location.reload()}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='3em'
						height='3em'
					>
						<path
							fill='darkgray'
							d='M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z'
						></path>
					</svg>
				</button>
			</Show>
		</>
	)
}
