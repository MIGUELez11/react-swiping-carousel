import React from 'react'
import './styles.module.scss'
import { CarouselComponent } from './lib/carousel-component/carousel-component.js'
export { CarouselComponent }

export const ExampleComponent = ({ text }) => {
  return <div className='test'>Example Component: {text}</div>
}
