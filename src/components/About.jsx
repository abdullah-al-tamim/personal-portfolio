'use client'

import Heading from './sub/Heading.jsx'
import Achievements from './sub/Achievements.jsx'
import Image from 'next/image'
import { aboutData, aboutText, arrowLeftIcon } from '@/assets/index.js'

const About = () => {
  return (
    <div className='min-h-screen px-96 flex flex-col items-center justify-center'>
        <Heading text={'About Me'}/>
        <div className='w-full flex items-center justify-between md:justify-center'>
            <Image src={'/about-me.png'} alt='About me img' width={400} height={400}
            className='w-[300px] lg:w-[200px] md:hidden'
            />
            <div className='max-w.[800px] rounded-xl bg-zinc-100 p-5 text-justify'>
              <span>Arrow left</span>
              <p>About text</p>
              <a href="/CV_Abdullah_al_Tamim.pdf" download="">
              <span>Download CV</span>
              <span>Download Icon</span>
              </a>
            </div>
        </div>
        <div>
          <Achievements/>
        </div>
    </div>
  )
}

export default About