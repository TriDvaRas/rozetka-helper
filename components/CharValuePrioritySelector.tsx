import { ButtonGroup, Button } from "react-bootstrap"

interface Props {
  onChange: (value: number) => void
  value: number
  variant?: string
  className?: string
}

export default function CharValuePrioritySelector(props: Props) {
  const { onChange, value, variant, className } = props
  return <ButtonGroup className={`${className || ''} `} >
    <Button variant={value == 0 ? variant || 'danger' : `outline-${variant || 'danger'}`} onClick={() => onChange(0)}>Дуже погано</Button>
    <Button variant={value == 30 ? variant || 'danger' : `outline-${variant || 'danger'}`} onClick={() => onChange(30)}>Погано</Button>
    <Button variant={value == 50 ? variant || 'secondary' : `outline-${variant || 'secondary'}`} onClick={() => onChange(50)}>Нейтрально</Button>
    <Button variant={value == 70 ? variant || 'success' : `outline-${variant || 'success'}`} onClick={() => onChange(70)}>Гарно</Button>
    <Button variant={value == 100 ? variant || 'success' : `outline-${variant || 'success'}`} onClick={() => onChange(100)}>Дуже гарно</Button>
  </ButtonGroup>
}
