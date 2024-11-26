'use client'
import Heading from "./sub/Heading"
import Award from "./sub/Award"
import { awardsData } from "@/assets"
import Image from "next/image"
import { animate, motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"




const Awards = () => {

  const [index, setIndex] = useState(0)
  const prevIndex = useRef(0)
  const buttonsRef = useRef([])


  useEffect(() => {
    prevIndex.current = index

  }, [index])
  return (
    <div id="awards">
      <Heading text={'Awards & Certificates'} />

      <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-y-10 lg:gap-y-20 py-10">
        {awardsData.map((data, i) => (
          <motion.div key={`id-${i}`} layout>
            <Award data={data} index={i} />
          </motion.div>
        ))}

      </div>

    </div>
  )
}

export default Awards