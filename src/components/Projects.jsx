'use client'

import Heading from "./sub/Heading"
import Project from "./sub/Project"
import { projectsData, projectsButton } from "@/assets"

const Projects = () => {
    return (
        <div className="min-h-screen py-20 px-80">
            <Heading text={'Projects'} />

            <div className="flex flex-wrap items-center justify-between gap-4 py-10">
                {projectsButton.map((text, i) => (
                    <button key={i} className="border border-yellow-500 rounded-xl px-2 py-1 text-sm font-light tracking-wider text-gray-400">{text}</button>
                ))}

            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
                {projectsData.map((data, i) => (
                    <div key={`id-${i}`}>
                        <Project data={data} index={i} />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Projects