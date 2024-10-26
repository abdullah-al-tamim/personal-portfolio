'use client'
import Heading from "./sub/Heading"
import Image from 'next/image'

const Experience = () => {
  return (
    <div className="relative py-20 px-96">
        <Heading text={"Experience & Education"} />
        <Image src={"/education.png"} alt={"Experience image"} width={400} height={400} className="absolute -top-4 right-96 opacity-70 lg:hidden"/>

        <div className="w-full h-full flex flex-col items-center justify-center gap-y-10 lg:gap-y-20 py-10">

            <div className="w-[600px] xl:w-[480px] sm:w-full px-12 sm:px-0 relative -left-[300px]">

                <div className="relative flex flex-col gap-y-3 rounded-md border border-red-400 bg-white p-4 tracking-wide sm:text-sm">
                    <h1 className="text-xl sm:text-lg font-light text-gray-700">Foundation and Basics</h1>
                    <p className="text-gray-800">
                        <span className="block font-light">Education: </span>
                        <span className="block pl-2 font-extralight">education: </span>
                    </p>
                    <div className="text-gray-800">
                        <span className="font-light">Experience: </span>
                        <ul className="pl-2">
                            <li className="my-1 font-extralight">experience:</li>
                        </ul>
                    </div>
                    <span className="absolute top-20 left-full text-red-300">icon</span>
                </div>
                <div className="w-14 absolute top-20 left-full border border-gray-300 rounded-full aspect-square grid place-items-center text-red-400 font-light">2020</div>
            </div>
            <div className="absolute w-1 h-full rounded-full bg-gray-300"></div>
        </div>

    </div>
  )
}

export default Experience