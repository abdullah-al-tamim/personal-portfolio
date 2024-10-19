'use client'
import Image from "next/image"
import {heroIcons} from "@/assets"


const Hero = () => {
  return (
    <div className="h-screen grid place-items-center">
      <div>
        <div className="flex flex-col items-center justify-center gap-y-3 font-light capitalize">
          <div className="flex items-center justify-center">
            <Image 
              src={'/person.png'} 
              alt="Tamim's image" 
              width={400} 
              height={400} 
              priority={true}
              className="h-auto w-[150px]"
            />
            <span className="absolute text-3xl font-semibold text-white">Hi there,</span>
          </div>
          <h1 className="text-center text-3xl font-bold tracking-wide text-gray-500">I'm Abdullah al Tamim &</h1>
          <p className="text-lg tracking-wider text-gray-700">I love animations 🤗</p>
        </div>


        <div className="mt-8 flex justify-center gap-x-10 text-3xl text-yellow-600">
          {heroIcons.map((icon, i) => (
            <a href="#" key={i} className=" hover:text-red-700 hover:font-extrabold transition-colors">{icon}</a>
          ))}
          
        </div>
        

        <a href="#" className="mx-auto mt-7 block w-max rounded-lg bg-red-400 px-3 py-1 font-light capitalize tracking-wider text-white hover:bg-red-500 hover:font-bold transition-colors">Talk to me</a>
      </div>
    </div>
  )
}

export default Hero