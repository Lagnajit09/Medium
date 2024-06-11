import { RiTwitterXLine } from "react-icons/ri";
import { RxLinkedinLogo } from "react-icons/rx";
import { RiFacebookCircleFill } from "react-icons/ri";
import { RiWhatsappLine } from "react-icons/ri";
import { HiOutlineLink } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ShareBlog = ({copyLink, setShowShareOpts}: {copyLink:string, setShowShareOpts:Function}) => {

    const [copyText, setCopyText] = useState('Copy Link')
    const shareOptsRef = useRef<HTMLDivElement>(null);

     const copyToClipboard = (): void => {
        navigator.clipboard.writeText(copyLink).then(() => {
            setCopyText('Copied')
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (shareOptsRef.current && !shareOptsRef.current.contains(event.target as Node)) {
            setShowShareOpts(false);
        }
    };

    const handleScroll = () => {
        setShowShareOpts(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
  

  return (
    <div className=" flex items-center bg-gray-50 rounded-md p-3 dark:bg-gray-700 border border-gray-300 shadow-sm" ref={shareOptsRef}>
        <div className=" flex flex-row items-center gap-3 pr-2 border-r">
            <Link target="_blank" to={'https://www.facebook.com/'} className=" flex flex-col items-center gap-2 cursor-pointer">
                <RiFacebookCircleFill />
                <span className="text-xs">Facebook</span>
            </Link>
            <Link target="_blank" to={'https://x.com/home'} className=" flex flex-col items-center gap-2 px-2 cursor-pointer">
                <RiTwitterXLine />
                <span className="text-xs">X</span>
            </Link>
            <Link target="_blank" to={'https://www.linkedin.com/feed/'} className=" flex flex-col items-center gap-2 cursor-pointer">
                <RxLinkedinLogo />
                <span className="text-xs">LinkedIn</span>
            </Link>
            <Link target="_blank" to={'https://web.whatsapp.com/?post_logout=1'} className=" flex flex-col items-center gap-2 cursor-pointer">
                <RiWhatsappLine />
                <span className="text-xs">WhatsApp</span>
            </Link>
        </div>
        <div className=" flex flex-col items-center gap-2 pl-2 cursor-pointer" onClick={copyToClipboard}>
            <HiOutlineLink />
            <span className="text-xs">{copyText}</span>
        </div>
    </div>
  )
}

export default ShareBlog