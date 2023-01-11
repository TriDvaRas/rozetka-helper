import { Inter } from '@next/font/google'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Badge, Card, Table, Form, Button, ButtonGroup } from 'react-bootstrap'
import { useLocalStorage } from 'usehooks-ts'
import OptionPrioritySelector from '../components/OptionPrioritySelector'
import { CompProps } from '../types/api'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()

  const [localCompProps, setLocalCompProps] = useLocalStorage<CompProps | undefined>('localCompProps', undefined)
  const [compProps, setCompProps] = useState<CompProps | undefined>(undefined)

  const [localSelectedOptions, setLocalSelectedOptions] = useLocalStorage<{ [key: string]: number }>('localOptions', { '-98': 2 })
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({ '-98': 2 })

  useEffect(() => {
    if (!localCompProps)
      router.replace(`/`)
    else
      setCompProps(localCompProps)
  }, [localCompProps, router])

  useEffect(() => {
    setSelectedOptions(localSelectedOptions)
  }, [localSelectedOptions])
  const onOptionSelect = (optionId: number, value: number) => {
    const id = `${optionId}`
    const newOptions = { ...selectedOptions }
    newOptions[id] = value
    setLocalSelectedOptions(newOptions)
  }
  return (
    <Card bg=''>
      <Card.Body>
        <Card.Title>Вибір Критеріїв</Card.Title>
        <Card.Subtitle className='mb-1'>
          Оберіть критерії які для ви бажаете використовувати у порівнянні та наскільки вони для вас важливі.
        </Card.Subtitle>
        {compProps && <Table hover className='mx-n3'>
          <thead>
            <tr>
              <th className='min-width'>Критерій</th>
              <th >Варіанти</th>
              <th className='min-width'>Важливість критерію</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='min-width'>Ціна</td>
              <td>{compProps.products.map(x => <Badge key={x.id} className='mx-1' >{x.price.current}₴</Badge>)}</td>
              <td className='min-width py-1'><OptionPrioritySelector onChange={(value) => onOptionSelect(-98, value)} value={selectedOptions['-98']} /></td>
            </tr>
            {
              compProps.options.filter(x => !x.same).map(x => <tr key={x.id}>
                <td className='min-width'>{x.title}</td>
                <td>{_.uniq(x.values.flat(1)).sort().map(v => <Badge key={v} className='mx-1 my-1' style={{ wordWrap: 'break-word',whiteSpace:'normal' }} dangerouslySetInnerHTML={{ __html: v }}></Badge>)}</td>
                <td className='min-width py-1'><OptionPrioritySelector onChange={(value) => onOptionSelect(x.id, value)} value={selectedOptions[x.id] || 0} /></td>
              </tr>)
            }
          </tbody>
        </Table>}
        <Card.Text className=''>
          *критерії що мають однакове значення серед усіх товарів не відображаються
        </Card.Text>
        <div className='w-100 d-flex align-items-center justify-content-between'>
          <Button onClick={() => router.replace(`/`)} variant='secondary'>Назад</Button>
          <Button onClick={() => router.replace(`/charValues`)}>Далі</Button>
        </div>
      </Card.Body>
    </Card>
  )
}
