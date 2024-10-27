'use client'
import Hero from "@/components/Hero"
import About from '@/components/About'
import Experience from "@/components/Experience"
import Skills  from "@/components/Skills"
import { Reviews } from "@/components/Reviews"
import Projects from "@/components/Projects"
import Contact from '@/components/Contact'

export default function Home() {
  return (
  <div>
    <Hero />
    <About />
    <Experience/>
    <Skills />
    <Projects/>
    <Contact />
  </div>)
}
