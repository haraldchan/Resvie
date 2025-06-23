import { Accessor, JSXElement, ValidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import OtaOptions from './ota-options'
import ModelOptions from './model-options'
import { Options } from '../Options'
import PromptOptions from './prompt-options'

type Props = {
	selectedOption: Accessor<Options>
	descriptions: Map<Options, string>
}

const optionPanels: Record<Options, ValidComponent> = {
	'大模型设置': ModelOptions,
	'OTA 网址配置': OtaOptions,
	'提示词设置': PromptOptions,
}

export default function OptionDetails({ selectedOption, descriptions }: Props) {
	const optionDescription = () => descriptions.get(selectedOption())

	return (
		<section id='option-details'>
			<h1>{selectedOption()}</h1>
			<p>{optionDescription()}</p>
			<div class='option-details-container'>
				<Dynamic component={optionPanels[selectedOption()]}></Dynamic>
			</div>
			<div style='height: 10vh;'></div>
		</section>
	)
}
