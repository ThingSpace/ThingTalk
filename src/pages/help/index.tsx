import React from 'react';
import { type NextPage } from 'next';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

const HelpPage: NextPage = () => {
    const router = useRouter();

    return (
        <motion.div
            className="flex min-h-screen w-screen flex-col items-center justify-center bg-opacity-[10%] bg-clouds-pattern p-10 font-spacemono font-semibold text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <NextSeo title="Help & FAQ" description="Frequently Asked Questions and Help for A Thing." />
            <div className="absolute top-5 left-5 cursor-pointer rounded-full bg-white p-2" onClick={() => router.back()}>
                <IoArrowBack className="h-10 w-10 p-2 text-black" />
            </div>
            <div className="flex w-full max-w-3xl flex-col gap-5 border-2 bg-white p-5 hover:border-black">
                <h1 className="text-4xl font-bold">Help & FAQ</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">What is A Thing?</h2>
                        <p className="font-normal">
                            A Thing is an open-source platform designed to provide a safe, secure, and anonymous environment for individuals to express themselves through journaling, ranting, venting, or offering support to others.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">How do I create an account?</h2>
                        <p className="font-normal">
                            You can create an account by navigating to the "Sign Up" page and providing a unique username and a strong password. Remember to write down your username and password as we do not store any personal data that could be tied back to you.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">Is my data safe and private?</h2>
                        <p className="font-normal">
                            Yes, A Thing is built with privacy in mind. The project is completely open source under the MIT License, allowing you to verify the source code yourself. We do not store any personal data that could be tied back to you, and accounts can be deleted at any time.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">How can I contribute?</h2>
                        <p className="font-normal">
                            We welcome contributions! You can find detailed instructions on how to contribute in our GitHub repository's `README.md` file.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">Where can I find the rules?</h2>
                        <p className="font-normal">
                            You can find the complete set of rules on the "Rules" page, accessible from the navigation menu.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HelpPage;
