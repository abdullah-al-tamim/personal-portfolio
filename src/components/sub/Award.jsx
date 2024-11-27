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
            className="w-[600px] xl:w-[480px] sm:w-full px-5 sm:px-0 relative"
        >
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: show ? 1 : 0 }} 
                whileInView={{ opacity: 1, y: 0 }}
                className="relative flex flex-col sm:flex-col sm:items-center gap-4 rounded-md border border-red-300 bg-white p-4 tracking-wide text-sm dark:bg-zinc-700 transition-colors z-20"
            >
                {/* Image Section */}
                <div className="relative w-full sm:w-[200px] h-[200px]">
                    <Image 
                        src={data.img} 
                        alt="Award Image" 
                        layout="fill" 
                        objectFit="cover" 
                        className="rounded-lg"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-start gap-y-3 text-center sm:text-left w-full">
                    <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
                        {data.title}
                    </h1>
                    <p className="text-gray-800 dark:text-gray-100">
                        <span className="font-bold">Institution:</span>
                        <span className="pl-2 font-light">{data.institution}</span>
                    </p>
                    <div className="text-gray-800 dark:text-gray-200">
                        <span className="font-bold">Details:</span>
                        <span className="pl-2 font-light">{data.details}</span>
                    </div>
                    <a 
                        href={data.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-max mx-auto sm:mx-0 rounded-lg bg-red-400 px-3 py-1 text-white hover:bg-red-500 transition-colors"
                    >
                        View Certificate
                    </a>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Award
