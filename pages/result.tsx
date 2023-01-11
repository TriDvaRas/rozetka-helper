import { Inter } from '@next/font/google'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Badge, Card, Table, Form, Button, ButtonGroup, Row, Col, Image, Collapse } from 'react-bootstrap'
import { BarLoader } from 'react-spinners'
import { useLocalStorage } from 'usehooks-ts'
import CharValuePrioritySelector from '../components/CharValuePrioritySelector'
import OptionPrioritySelector from '../components/OptionPrioritySelector'
import { CompProps } from '../types/api'
import { RZProduct } from '../types/RZ';
import nj from 'numjs'
import solveSmart from '../util/smart';
import { sellStatusToColor, sellStatusToString } from '../util/RZapi';
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()

  const [localCompProps, setLocalCompProps] = useLocalStorage<CompProps | undefined>('localCompProps', undefined)
  const [localSelectedOptions, setLocalSelectedOptions] = useLocalStorage<{ [key: string]: number }>('localOptions', { '-98': 2 })
  const [localChars, setLocalChars] = useLocalStorage<{ [key: string]: number }>('localChars', {})

  // const [result, setResult] = useState<any | undefined>(undefined)
  const [result, setResult] = useState<(RZProduct & { score: number })[] | undefined>(undefined)
  const [showBestChars, setShowBestChars] = useState(false)
  useEffect(() => {
    if (!localCompProps)
      router.replace(`/`)
  }, [localCompProps, router])

  useEffect(() => {
    if (!result && localCompProps && localChars) {
      let validOpts = localCompProps.options.filter(x => !x.same && (localSelectedOptions[x.id] || 0) !== 0) || []
      let optCoefs = validOpts.map(x => x.values.map(v => typeof localChars[`${x.id}:${v}`] == 'number' ? localChars[`${x.id}:${v}`] : 50))
      validOpts = validOpts.filter((x, i) => _.uniq(optCoefs[i]).length > 1)
      optCoefs = nj.array(optCoefs.filter((x) => _.uniq(x).length > 1)).T.tolist()
      const A = localCompProps.products.map((x, i) => [
        ...((localSelectedOptions['-98'] || 0) !== 0 ? [-x.price.current] : []),
        ...optCoefs[i]
      ])
      const w = [
        ...((localSelectedOptions['-98'] || 0) !== 0 ? [localSelectedOptions['-98']] : []),
        ...validOpts.map(x => localSelectedOptions[x.id])
      ]
      // console.log(A);
      // console.log(w);
      const validRows = A.map(x => _.uniq(x).length > 1)
      const af = A.filter(x => _.uniq(x).length > 1)
      const wf = w.filter((__, i) => _.uniq(A[i]).length > 1)
      console.log({ A, w });
      console.log({ af, wf });
      console.log({ validRows });

      const res = solveSmart(A, w)
      // console.log(res);

      setResult(localCompProps.products.map((x, i) => ({ ...x, score: res[i] })))
    }
  }, [localChars, localCompProps, localSelectedOptions, result])

  const top = result ? _.orderBy(result, 'score', 'desc') : undefined
  const best = top && top[0]
  const bestIndex = localCompProps?.products.findIndex(x => x.id == best?.id)
  return (
    <Card bg=''>
      <Card.Body>
        {top ? <div>
          <Card.Title>Метод SMART радить вибрати наступний товар. Нижче також представлені інші товари в порядку зменшення оцінки SMART</Card.Title>
          {best && <Card className='mb-3'>
            <Card.Img src={best.images[0].original} style={{
              maxHeight: '35vh',
              objectFit: 'contain',
              // objectPosition: '50 50'
            }}></Card.Img>
            <Card.Body>
              <Card.Title>{best.title}</Card.Title>
              <div className='d-flex align-items-center w-100'>
                <Card.Title ><h2 className='mb-0 me-1'>{best.price.current}₴</h2></Card.Title>
                {best.price.old ? <s style={{ color: 'var(--bs-gray-500)' }}>{best.price.old}₴</s> : null}
                <Card.Text className={`ms-auto text-${sellStatusToColor(best.sell_status)}`}>{sellStatusToString(best.sell_status)}</Card.Text>

              </div>

              <Card.Subtitle>Бал SMART: {Math.round(best.score * 1000) / 1000}</Card.Subtitle>

              <Row className=''>
                <Col><Button className='w-100 mt-1' onClick={() => setShowBestChars(!showBestChars)}>Характеристики</Button></Col>
                <Col><Link href={best.href}><Button className='w-100 mt-1'>Придбати</Button></Link></Col>
              </Row>
              <Collapse mountOnEnter appear in={showBestChars} timeout={0}>
                <Table className='w-100'>
                  <tbody>
                    {localCompProps && bestIndex && localCompProps.options.filter(x => x.values[bestIndex][0] !== '-').map(x => <tr key={x.id} className={''}>
                      <td className='min-width'>{x.title}</td>
                      <td dangerouslySetInnerHTML={{ __html: x.values[bestIndex][0] || '-' }}></td>
                    </tr>)}
                  </tbody>
                </Table>
              </Collapse>
            </Card.Body>
          </Card>}
          <Row xl={4} lg={3} md={2} >
            {top.slice(1).map(x => <Col key={x.id}>
              <Card className='mb-3'>
                <Card.Img src={x.images[0].original} style={{
                  maxHeight: Math.max(1200 / top.length, 300),
                  objectFit: 'contain',
                  // objectPosition: '50 50'
                }}></Card.Img>
                <Card.Body>
                  <Card.Title>{x.title}</Card.Title>
                  <div className='d-flex align-items-center w-100'>
                    <Card.Title ><h2 className='mb-0 me-1'>{x.price.current}₴</h2></Card.Title>
                    {x.price.old ? <s style={{ color: 'var(--bs-gray-500)' }}>{x.price.old}₴</s> : null}
                    <Card.Text className={`ms-auto text-${sellStatusToColor(x.sell_status)}`}>{sellStatusToString(x.sell_status)}</Card.Text>

                  </div>

                  <Card.Subtitle>Бал SMART: {Math.round(x.score * 1000) / 1000}</Card.Subtitle>
                  <Link href={x.href}><Button className='w-100 mt-1'>Придбати</Button></Link>
                </Card.Body>
              </Card>
            </Col>)}
          </Row>
        </div> : <div className='w-100 my-3'><BarLoader color='#6f42c1' width={'100%'} /></div>}
        <div className='w-100 d-flex align-items-center justify-content-between'>
          <Button onClick={() => router.replace(`/charValues`)} variant='secondary'>Назад</Button>
          {/* <Button onClick={() => router.replace(`/result`)}>Далі</Button> */}
        </div>
      </Card.Body>
    </Card>
  )
}

