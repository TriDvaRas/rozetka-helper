import { ButtonGroup, Button } from "react-bootstrap"

interface Props {
  onChange: (value: number) => void
  value: number
  variant?: string
}

export default function OptionPrioritySelector(props: Props) {
  const { onChange, value, variant } = props
  const _variant = variant || 'secondary'
  return <ButtonGroup >
    <Button variant={value == 5 ? _variant : `outline-${_variant}`} onClick={() => onChange(5)}>Дуже висока</Button>
    <Button variant={value == 3 ? _variant : `outline-${_variant}`} onClick={() => onChange(3)}>Висока</Button>
    <Button variant={value == 2 ? _variant : `outline-${_variant}`} onClick={() => onChange(2)}>Середня</Button>
    <Button variant={value == 1 ? _variant : `outline-${_variant}`} onClick={() => onChange(1)}>Низька</Button>
    <Button variant={value == 0 ? _variant : `outline-${_variant}`} onClick={() => onChange(0)}>Не використовувати</Button>
  </ButtonGroup>
}
