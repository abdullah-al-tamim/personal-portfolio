'use client'
import Image from "next/image"

const Hero = () => {
  return (
    <div className="h-screen grid place-items-center">
      <div>
        <div>
          <div>
            <Image 
            src={'/person.png'} 
            alt="Tamim's image" 
            width={400} 
            height={400} 
            priority={true}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero