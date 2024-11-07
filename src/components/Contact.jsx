'use client'
import Heading from './sub/Heading'
import Image from 'next/image'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react'

const Contact = () => {
    const form = useRef();
    const [notification, setNotification] = useState("");  // New state for notification message

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                form.current,
                { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
            )
            .then(
                () => {
                    setNotification("Your message has been received! I will get back to you soon..😀"); 
                    form.current.reset();  
                    setTimeout(() => setNotification(""), 3000);  
                },
                (error) => {
                    console.log('FAILED...', error.text);
                    setNotification("Failed to send message. Please try again later. 🙂");  
                }
            );
    };

    return (
        <div id="contact" className="h-screen lg:h-auto lg:py-40 py-20 ">
            <Heading text={'Get in Touch'} />
            <div className="w-full h-full my-auto flex lg:flex-col items-center justify-between lg:justify-center gap-x-20 lg:gap-x-0 gap-y-20">
                <motion.div
                    initial={{ opacity: 0, y: 150 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Image src={'/contact.gif'} alt="Contact Image" width={400} height={400} className="w-[400px] rounded-md opacity-80" />
                </motion.div>
                <motion.form
                    initial={{ opacity: 0, x: 150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="w-[600px] lg:w-[400px] sm:w-full flex flex-col gap-3"
                    ref={form}
                    onSubmit={sendEmail}
                >
                    <div className="w-full flex lg:flex-col gap-x-3 lg:gap-y-3">
                        <input
                            type="text"
                            name="user_name"
                            className="w-full border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-500 outline-none"
                            placeholder="Your Name"
                        />
                        <input
                            type="email"
                            name="user_email"
                            className="w-full border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-500 outline-none"
                            placeholder="Your email"
                        />
                    </div>
                    <input
                        type="text"
                        name="subject"
                        className="w-full border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-500 outline-none"
                        placeholder="Subject"
                    />
                    <textarea
                        name="message"
                        className="max-h-[250px] min-h-[150px] border border-yellow-500 rounded-md bg-zinc-100 px-4 py-2 text-sm tracking-wider text-gray-500 outline-none"
                        placeholder="Write me..."
                    ></textarea>
                    <input
                        type="submit"
                        className="w-full border border-yellow-500 rounded-md bg-yellow-600 px-4 py-2 text-sm font-light tracking-wider text-white outline-none hover:bg-yellow-500 transition-colors cursor-pointer"
                        value={"Send Message"}
                    />
                    {/* Display notification message */}
                    {notification && <p className="mt-4 text-center text-green-600">{notification}</p>}
                </motion.form>
            </div>
        </div>
    )
}

export default Contact
