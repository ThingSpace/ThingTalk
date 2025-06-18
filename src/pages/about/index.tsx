import React from 'react';
import { type NextPage } from 'next';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

const AboutPage: NextPage = () => {
    const router = useRouter();

    return (
        <motion.div
            className="flex min-h-screen w-screen flex-col items-center justify-center bg-opacity-[10%] bg-clouds-pattern p-10 font-spacemono font-semibold text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <NextSeo title="About Us" description="Learn more about A Thing." />
            <div className="absolute top-5 left-5 cursor-pointer rounded-full bg-white p-2" onClick={() => router.back()}>
                <IoArrowBack className="h-10 w-10 p-2 text-black" />
            </div>
            <div className="flex w-full max-w-3xl flex-col gap-5 border-2 bg-white p-5 hover:border-black">
                <h1 className="text-4xl font-bold">About A Thing</h1>
                <div className="flex flex-col gap-4">
                    <p className="font-normal">
                        A Thing was created with a simple yet powerful vision: to provide a safe, secure, and anonymous space for everyone to express themselves freely. In a world where mental health and personal struggles often go unaddressed, we believe in the importance of having a platform where voices can be heard without judgment.
                    </p>
                    <p className="font-normal">
                        Our mission is to foster a supportive community where individuals can journal their thoughts, vent frustrations, share experiences, and offer support to others, all while maintaining their anonymity. We are committed to building a platform that prioritizes user privacy and promotes responsible communication.
                    </p>
                    <p className="font-normal">
                        As an open-source project, A Thing is built on transparency and collaboration. We encourage contributions from the community to help us grow and improve, ensuring that the platform remains a valuable resource for everyone.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
