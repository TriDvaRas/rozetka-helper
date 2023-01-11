import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap'
import { useState } from 'react'
import globalConfig from '../globalConfig';
import { useRouter } from 'next/router'
import axios from 'axios'
import { CompProps } from '../types/api'
import { useLocalStorage } from 'usehooks-ts'
import { BarLoader } from 'react-spinners'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const [rzLink, setRzLink] = useState<string | undefined>(undefined)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [localCompProps, setLocalCompProps] = useLocalStorage<CompProps | undefined>('localCompProps', undefined)
  const [localSelectedOptions, setLocalSelectedOptions] = useLocalStorage<{ [key: string]: number }>('localOptions', { '-98': 2 })
  const [localChars, setLocalChars] = useLocalStorage<{ [key: string]: number }>('localChars', {})
  const isLinkValid = !!rzLink?.match(globalConfig.rzLinkRegex)
  const onAnalyzeClick = () => {
    setIsAnalyzing(true)
    axios.get<CompProps>(`/api/getCompProps?link=${rzLink}`)
      .then((res) => {
        setLocalCompProps(res.data)
        // setLocalSelectedOptions({ '-98': 2 })
        setIsAnalyzing(false)
        router.replace('/options')
      })
      .catch(err => {
        console.error(err)
        setIsAnalyzing(false)
      })
  }
  return (
    <Container className='p-3'>
      <Card bg=''>
        <Card.Body>
          <Card.Title>Rozetka Helper</Card.Title>
          <Card.Subtitle className='mb-1'>
            Ця утиліта допомагає з вибором найбільш відповідного до забажань користувача продукту в інтернет-магазині Rozetka.
          </Card.Subtitle>
          <Card.Text>
            Для використання оберіть кілька товарів на сайті Rozetka, додайте їх до списку порівняння, потім перейдіть на сторінку порівняння, скопіюйте її посилання у поле нижче та натисніть &apos;Аналізувати&apos;.
          </Card.Text>
          <div className='d-flex align-items-center justify-content-center '>
            <InputGroup hasValidation>
              <Form.FloatingLabel label='Посилання на сторінку порівняння'>
                <Form.Control type='input' placeholder=' ' isValid={isLinkValid} isInvalid={!isLinkValid && !!rzLink && (rzLink.length > 0)} onChange={(e) => setRzLink(e.target.value)} />
                <Form.Control.Feedback type='invalid'>
                  Невірне посилання. Приклад валідного посилання: https://rozetka.com.ua/ua/comparison/c80073/ids=308129543,336888409,354203634/
                </Form.Control.Feedback>
              </Form.FloatingLabel>
            </InputGroup>
            <Button variant="primary" style={{ height: '58px' }} className='ms-2' disabled={!isLinkValid || isAnalyzing} onClick={onAnalyzeClick}>
              Аналізувати
            </Button>
          </div>
          {isAnalyzing && <BarLoader color='#6f42c1' width={'100%'}></BarLoader>}
        </Card.Body>
      </Card>
    </Container>
  )
}
