'use client'
import Image from "next/image"
import { animate, motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"

const Award = ({ data, index }) => {
    const [show, setShow] = useState(false)

    return (
        <motion.div initial={{ opacity: 0, y: index % 2 === 0 ? 100 : -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }} key={`id-${index}`} className={`w-[600px] xl:w-[480px] sm:w-full px-5 sm:px-0 relative `}>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} whileInView={{ opacity: 1, y: 0 }}
                className="relative flex flex-col gap-y-3 rounded-md border border-red-300 bg-white p-4 tracking-wide sm:text-sm dark:bg-zinc-700 transition-colors z-20">
                <Image src={data.img} alt="Project Image" width={400} height={400} className="rounded-lg opacity-70" />
                <h1 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-white transition-colors">{data.title}</h1>
                <p className="text-gray-800 dark:text-gray-100 transition-colors">
                    <span className="block font-bold">Institution: </span>
                    <span className="block pl-2 font-extralight">{data.institution}</span>
                </p>
                <div className="text-gray-800 dark:text-gray-200 transition-colors">
                    <span className="font-bold">Details: </span>
                    <span className="block pl-2 font-extralight">{data.details}</span>
                </div>
                
            </motion.div>

        </motion.div>
    )
}

export default Award