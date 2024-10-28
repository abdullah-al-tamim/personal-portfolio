'use client'
import Hero from "@/components/Hero"
import About from '@/components/About'
import Experience from "@/components/Experience"
import Skills from "@/components/Skills"
import { Reviews } from "@/components/Reviews"
import Projects from "@/components/Projects"
import Contact from '@/components/Contact'
import Questions from "@/components/Questions"
import Navbar from "@/components/Navbar"
import Toggle from "@/components/sub/Toggle"
import { useState, useRef, useEffect } from "react"


export default function Home() {
  const [id, setId] = useState(0)
  const compsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const intersecting = entry.isIntersecting
          if (intersecting) {
            setId(entry.target.id)
          }
        })
      }, { threshold: .3 }
    )

    const compsArr = Array.from(compsRef.current.children)
    compsArr.forEach((comp) => {
      observer.observe(comp)
    })
  }, [])

  return (
    <>
      {/* <Toggle> */}
        <Navbar id={id} />
        <div ref={compsRef}>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
          <Questions />
        </div>
      {/* </Toggle> */}
    </>
  )
}
