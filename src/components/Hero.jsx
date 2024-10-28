'use client'
import Image from "next/image"
import { heroIcons } from "@/assets"
import { useMotionValue, useTransform, motion, useSpring } from "framer-motion"
import { useState } from "react"


const Hero = () => {
  const [windowOffset, setWindowOffset] = useState({ innerWidth: 0, innerHeight: 0 })
  const [mouseMove, setMouseMove] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    x.set(clientX)
    y.set(clientY)

    // console.log(clientX, clientY, x, y)
  }

  const handleMouseEnter = () => {
    setWindowOffset({ innerWidth: window.innerWidth, innerHeight: window.innerHeight })
    setMouseMove(true)

    console.log(innerWidth, innerHeight)
  }

  const { innerWidth, innerHeight } = windowOffset

  // useSpring animations
  const xSpring = useSpring(x, {stiffness: 200, damping: 30})
  const ySpring = useSpring(y, {stiffness: 200, damping: 30})

  const rotateY = useTransform(xSpring, [0, innerWidth], [-30, 30])
  const rotateX = useTransform(ySpring, [0, innerHeight], [30, -20])


  


  return (
    <div id="home" className="h-screen grid place-items-center" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter}>
      <div>
        <div className="flex flex-col items-center justify-center gap-y-3 font-light capitalize">
          <motion.div className="flex items-center justify-center" style={{ 
            rotateX: mouseMove ? rotateX : 0, 
            rotateY: mouseMove ? rotateY : 0, 
            transition: '0.1s' 
            }}>
            <Image
              src={'/avatar.png'}
              alt="Tamim's image"
              width={800}
              height={800}
              priority={true}
              className="h-auto w-[150px]"
            />
            <motion.span className="absolute text-3xl font-semibold text-white" initial={{scale: 0}} 
            animate={{opacity: buttonHover ? 0 : 1, 
                      scale: buttonHover ? 2 : 0, 
                      y: buttonHover ? -40 : 0}}
            transition={{opacity: {delay: 0.4}}}
            >
              Hi..
            </motion.span>
          </motion.div>
          <h1 className="text-center text-3xl font-bold tracking-wide text-gray-500 sm:text-2xl dark:text-white transition-colors">I'm Abdullah al Tamim &</h1>
          <p className="text-lg tracking-wider text-gray-700 dark:text-gray-200 transition-colors">I love animations 🤗</p>
        </div>


        <div className="mt-8 flex justify-center gap-x-10 text-3xl text-yellow-600 sm:text-2xl">
  {heroIcons.map((icon, i) => {
    let url = ""; 

    if (i === 0) {
      url = "https://www.facebook.com/tamim.977";
    } else if (i === 1) {
      url = "https://twitter.com/yourprofile"; 
    } else if (i === 2) {
      url = "https://www.linkedin.com/in/yourprofile"; 
    } else if (i === 3) {
      url = "https://www.instagram.com/yourprofile"; 
    }

    return (
      <a
        href={url}
        key={i}
        target="_blank"  // Opens in a new tab
        rel="noopener noreferrer"  // Prevents security issues
        className="hover:text-red-700 hover:font-extrabold transition-colors"
      >
        {icon}
      </a>
    );
  })}
</div>


        <a href="#" className="mx-auto mt-7 block w-max rounded-lg bg-red-400 px-3 py-1 font-light capitalize tracking-wider text-white hover:bg-red-500 hover:font-bold transition-colors" 
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
        >Talk to me</a>
      </div>
    </div>
  )
}

export default Hero