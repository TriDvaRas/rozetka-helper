import { Inter } from '@next/font/google'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Badge, Card, Table, Form, Button, ButtonGroup, Row, Col } from 'react-bootstrap'
import { useLocalStorage } from 'usehooks-ts'
import CharValuePrioritySelector from '../components/CharValuePrioritySelector'
import OptionPrioritySelector from '../components/OptionPrioritySelector'
import { CompProps } from '../types/api'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()

  const [localCompProps, setLocalCompProps] = useLocalStorage<CompProps | undefined>('localCompProps', undefined)
  const [localSelectedOptions, setLocalSelectedOptions] = useLocalStorage<{ [key: string]: number }>('localOptions', { '-98': 2 })

  const [compProps, setCompProps] = useState<CompProps | undefined>(undefined)

  const [localChars, setLocalChars] = useLocalStorage<{ [key: string]: number }>('localChars', {})
  const [chars, setChars] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (!localCompProps)
      router.replace(`/`)
    else
      setCompProps(localCompProps)
  }, [localCompProps, router])

  useEffect(() => {
    setChars(localChars)
  }, [localChars])
  const onOptionSelect = (optionId: string, value: number) => {
    const newChars = { ...chars }
    newChars[optionId] = value
    setLocalChars(newChars)
  }
  return (
    <Card bg=''>
      <Card.Body>
        <Card.Title>Вибір якості варіантів</Card.Title>
        <Card.Subtitle className='mb-3'>
          Оберіть якість доступних варіантів для обраних критеріїв
        </Card.Subtitle>
        <Row>
          {compProps && (compProps.options.filter(x => !x.same && (localSelectedOptions[x.id] || 0) !== 0).sort((a, b) => b.values.length - a.values.length)).map(x => <Col className='mb-2 mx-0' key={x.id}><Card style={{ backgroundColor: 'var(--bs-gray-100)' }}>
            <Card.Body>
              <Card.Title className='text-center'>{x.title}</Card.Title>
              <div className=''>
                {_.uniq(x.values.flat(1)).sort().map(v => <div key={v} className={' d-flex flex-column'}>
                  <Card.Subtitle className='text-center my-1'>{v}</Card.Subtitle>
                  <CharValuePrioritySelector className='mb-2' onChange={value => onOptionSelect(`${x.id}:${v}`, value)} value={typeof chars[`${x.id}:${v}`] == 'number' ? chars[`${x.id}:${v}`] : 50} />
                </div>)}
              </div>
            </Card.Body>
          </Card></Col>)}
        </Row>
        <div className='w-100 d-flex align-items-center justify-content-between'>
          <Button onClick={() => router.replace(`/options`)} variant='secondary'>Назад</Button>
          <Button onClick={() => router.replace(`/result`)}>Далі</Button>
        </div>
      </Card.Body>
    </Card>
  )
}
