'use client'
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"

const Award = ({ data, index }) => {
    const [show, setShow] = useState(false)

    return (
        <motion.div 
            initial={{ opacity: 0, y: index % 2 === 0 ? 100 : -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            key={`id-${index}`} 
            className={`w-[600px] xl:w-[480px] sm:w-full px-5 sm:px-0 relative`}
        >
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: show ? 1 : 0 }} 
                whileInView={{ opacity: 1, y: 0 }}
                className="relative flex gap-x-4 rounded-md border border-red-300 bg-white p-4 tracking-wide sm:text-sm dark:bg-zinc-700 transition-colors z-20"
            >
                {/* Image on the left */}
                <div className="flex-shrink-0 w-[200px] h-[200px] relative">
                    <Image 
                        src={data.img} 
                        alt="Project Image" 
                        layout="fill" 
                        objectFit="cover" 
                        className="rounded-lg opacity-100"
                    />
                </div>
                
                {/* Details on the right */}
                <div className="flex flex-col justify-start gap-y-3">
                    <h1 className="text-xl sm:text-lg font-semibold text-gray-700 dark:text-white transition-colors">
                        {data.title}
                    </h1>
                    <p className="text-gray-800 dark:text-gray-100 transition-colors">
                        <span className=" font-bold">Institution: </span>
                        <span className=" pl-2 font-extralight">{data.institution}</span>
                    </p>
                    <div className="text-gray-800 dark:text-gray-200 transition-colors">
                        <span className="font-bold">Details: </span>
                        <span className=" pl-2 font-extralight">{data.details}</span>
                    </div>
                    {/* Button to open the certificate URL */}
                    <a 
                        href={data.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className=" block w-max rounded-lg bg-red-400 px-3 py-1 font-light capitalize tracking-wider text-white hover:bg-red-500 transition-colors"
                    >
                        View Certificate
                    </a>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Award
