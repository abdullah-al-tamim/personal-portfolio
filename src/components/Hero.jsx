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
              priority={true}
            />
            <span>Hi there,</span>
          </div>
          <h1>I'm Abdullah al Tamim &</h1>
          <p>I love animations 🤗</p>
        </div>
        <div>
          <a href="#">Icon</a>
        </div>
        <a href="#">Talk to me</a>
      </div>
    </div>
  )
}

export default Hero