'use client'
import Heading from "./sub/Heading"
import Image from "next/image"

export const Skills = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-20 px-96">
        <Heading text = {"Skills"} />

        <div className="w-full flex justify-between flex-wrap gap-x-8 gap-y-10 lg:gap-y-6">
            <div className="flex items-center justify-center gap-x-3 rounded-xl border border-yellow-500 bg-zing-200 px-5 py-2 lg:px-2">
                <Image src={'/skills/js.png'} alt="Skills image" width={100} height={100} className="h-auto w-[40px]"/>
                <p className="text-sm text-gray-600 ">JS</p>
            </div>
        </div>
    </div>
  )
}

export default Skills
