type Props = {
	viewBox?: string
	width?: string
	height?: string
	fill?: string
	stroke?: string
}

export function SettingIcon({ viewBox, width, height, fill, stroke }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 24 24'}
			width={width || '15px'}
			height={height || '15px'}
		>
			<g
				fill={fill || 'none'}
				stroke={stroke || 'currentColor'}
			>
				<path d='M3.082 13.945c-.529-.95-.793-1.426-.793-1.945s.264-.994.793-1.944L4.43 7.63l1.426-2.381c.559-.933.838-1.4 1.287-1.66c.45-.259.993-.267 2.08-.285L12 3.26l2.775.044c1.088.018 1.631.026 2.08.286s.73.726 1.288 1.659L19.57 7.63l1.35 2.426c.528.95.792 1.425.792 1.944s-.264.994-.793 1.944L19.57 16.37l-1.426 2.381c-.559.933-.838 1.4-1.287 1.66c-.45.259-.993.267-2.08.285L12 20.74l-2.775-.044c-1.088-.018-1.631-.026-2.08-.286s-.73-.726-1.288-1.659L4.43 16.37z'></path>
				<circle
					cx='12'
					cy='12'
					r='3'
				></circle>
			</g>
		</svg>
	)
}

export function CancelIcon({ viewBox, width, height, fill }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 512 512'}
			width={width || '20px'}
			height={height || '20px'}
		>
			<path
				fill={fill || 'red'}
				fill-rule='evenodd'
				d='M420.48 121.813L390.187 91.52L256 225.92L121.813 91.52L91.52 121.813L225.92 256L91.52 390.187l30.293 30.293L256 286.08l134.187 134.4l30.293-30.293L286.08 256z'
			></path>
		</svg>
	)
}

export function OkIcon({ viewBox, width, height, fill }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 20 20'}
			width={width || '25px'}
			height={height || '25px'}
		>
			<path
				fill={fill || 'green'}
				d='m15.3 5.3l-6.8 6.8l-2.8-2.8l-1.4 1.4l4.2 4.2l8.2-8.2z'
			></path>
		</svg>
	)
}

export function DeleteIcon({ viewBox, width, height, fill }: Props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox={viewBox || '0 0 32 32'}
			width={width || '20px'}
			height={height || '20px'}
		>
			<path
				fill={fill || 'currentColor'}
				d='M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-3.78 5.78l-1.44 1.44L14.564 16l-3.782 3.78l1.44 1.44L16 17.437l3.78 3.78l1.44-1.437L17.437 16l3.78-3.78l-1.437-1.44L16 14.564l-3.78-3.782z'
			></path>
		</svg>
	)
}
