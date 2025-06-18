import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoArrowBack, IoClose } from 'react-icons/io5';

const RulesData = {
	0: {
		title: 'Freedom of Expression & Zero Tolerance for Hate',
		description:
			'We champion open expression and believe every voice deserves to be heard. However, this platform has zero tolerance for hate speech, harassment, threats of violence, or any content that promotes discrimination. Responsible communication is paramount.',
	},
	1: {
		title: 'Protecting Privacy: Fictionalize Personal Stories',
		description:
			'When sharing personal stories, you must use fictional names, characters, and locations. This protects your privacy and the privacy of others. Doxing or outing is strictly prohibited.',
	},
	2: {
		title: 'Respectful Disagreement: Scroll Past',
		description:
			'If you encounter content you disagree with, please scroll past. Engaging in arguments or disrespectful discourse is not permitted. Maintain a positive and constructive environment.',
	},
	3: {
		title: 'Strictly No Illegal Content (Canadian Law)',
		description:
			'Any content or activity deemed illegal under Canadian Federal or Provincial law is strictly prohibited and will result in an immediate, permanent ban.',
	},
};

const RulesPage = () => {
	const [showRuleInfo, setShowRuleInfo] = React.useState(false);
	const [ruleInfo, setRuleInfo] = React.useState(RulesData[0]);
	const router = useRouter();

	return (
		<motion.div
			className={`flex min-h-screen w-screen flex-col items-center justify-center bg-opacity-[10%] bg-clouds-pattern p-10 font-spacemono font-semibold text-black`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}>
			<NextSeo title="Rules" description="The Rule's Page Of A Thing." />
			<div className="mt-[60px] flex w-full flex-col gap-5 lg:flex-row">
				<div className="absolute top-5 left-5 cursor-pointer rounded-full bg-white p-2" onClick={() => router.back()}>
					<IoArrowBack className="h-10 w-10 p-2 text-black" />
				</div>
				<div className="flex w-fit flex-col justify-center gap-5 border-2 bg-white p-5 hover:border-black">
					<h1 className="text-2xl font-bold">Note</h1>
					<div className="flex flex-col font-normal">
						<h6 className=""></h6>
						<p className="">
							Welcome to <b className="font-semibold text-green-600 underline decoration-wavy">A Thing</b>.
							We believe in the power of open expression and the right for every voice to be heard.
							This platform is built on the principle of responsible communication.
							While we encourage diverse opinions, we maintain a strict zero tolerance policy for any violations of the rules outlined in this page.
							Breaking these rules <b className="font-semibold text-red-600">will result in a permanent ban.</b>
							{" "}If you have any suggestions or feedback, drop me a{' '}
							<a
								href="https://twitter.com/intent/tweet?screen_name=theathingapp"
								className="cursor-pointer font-semibold text-blue-600 underline decoration-wavy"
								target="_blank"
								rel="noreferrer">
								tweet
							</a>
							. Regards,{<br />}{<br />}
							Pixelated
						</p>
					</div>
				</div>
				<div className="flex flex-col border-2 bg-white p-5 hover:border-black">
					<h1 className="text-2xl font-bold">Rules</h1>
					<div className="flex flex-col font-normal">
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[0]);
								setShowRuleInfo(true);
							}}>
							1. Freedom of Expression & Zero Tolerance for Hate
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[1]);
								setShowRuleInfo(true);
							}}>
							2. Protecting Privacy: Fictionalize Personal Stories
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[2]);
								setShowRuleInfo(true);
							}}>
							3. Respectful Disagreement: Scroll Past
						</h6>
						<h6
							className="cursor-pointer p-2 hover:bg-black hover:text-white"
							onClick={() => {
								setRuleInfo(RulesData[3]);
								setShowRuleInfo(true);
							}}>
							4. Strictly No Illegal Content (Canadian Law)
						</h6>
					</div>
				</div>
				{showRuleInfo ? (
					<motion.div
						className="fixed top-[50%] left-[50%] flex h-fit w-[300px] -translate-x-[50%] -translate-y-[50%] flex-col gap-2 border-2 border-black bg-white p-10 lg:w-fit"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}>
						<div
							className="absolute -top-5 -right-5 cursor-pointer rounded-full border-2 border-black bg-white p-5"
							onClick={() => setShowRuleInfo(false)}>
							<IoClose className="sq-6" />
						</div>
						<h1 className="text-2xl font-bold">What?</h1>
						<p className="font-normal">{ruleInfo.title}</p>
						<h1 className="text-2xl font-bold">Why?</h1>
						<p className="font-normal">{ruleInfo.description}</p>
					</motion.div>
				) : null}
			</div>
		</motion.div>
	);
};

export default RulesPage;
