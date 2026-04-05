import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { useState } from 'react'
import { ArrowLeft, Code2, Loader2, MessageSquare, Monitor, Rocket, Send, Share2, X } from 'lucide-react'
import { useRef } from 'react'
import { AnimatePresence,motion } from 'motion/react'
import {Editor} from '@monaco-editor/react'
const WebEditor = () => {
    const { id } = useParams()
    const [website, setWebsite] = useState(null)
    const navigate=useNavigate()
    const [error, setError] = useState("");
    const iframeRef = useRef(null)
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const [updateLoading,setUpdateLoading]=useState(false);
    const [thinkingIndex,setThinkingIndex]=useState(0)
    const [showCode,setShowCode]=useState(false);
    const [showFullPreview,setShowFullPreview]=useState(false);
    const [showChat,setShowChat]=useState(false);
    const thinkingSteps=[
        "Understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Finalizing update..."
    ]

        const handleShare = (e, id) => {
  e.stopPropagation()

  const url = `${window.location.origin}/site/${id}`

  navigator.clipboard.writeText(url)

  alert("Link copied to clipboard!")
}

    const handleDeploy = async (id) => {
  try {
    await axios.get(`${serverUrl}/api/website/deploy/${id}`, {
      withCredentials: true
    })

    window.open(`/site/${id}`, "_blank") // ✅ FIX
  } catch (error) {
    console.log(error)
  }
}

    const handleUpdate = async () => {
        setUpdateLoading(true);
        const currentPrompt = prompt // ✅ store it

        if (!currentPrompt.trim()) return

        setMessages((m) => [...m, { role: "user", content: currentPrompt }])

        setPrompt("") // ✅ clear immediately (move here)

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                { prompt: currentPrompt },
                { withCredentials: true }
            )
            setUpdateLoading(false);
            setMessages((m) => [
                ...m,
                { role: "ai", content: result.data.message }
            ])

            setCode(result.data.code)
            

        } catch (error) {
            setUpdateLoading(false);
            console.log(error)
        }
    }

    useEffect(()=>{
        if(!updateLoading) return;
        const i=setInterval(()=>{
            setThinkingIndex((i)=>(i+1)%thinkingSteps.length)
        },1200)

        return ()=>clearInterval(i)
    },[updateLoading])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (err) {
                console.log(err)
                setError(err.response.data.message)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return

        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => {
            URL.revokeObjectURL(url)
        }
    }, [code])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }

    if (!website) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
                <Loader2 className="animate-spin" />
            </div>
        )
    }
    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            
            <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80 '>
                <Header />
                <>
                    <div className='flex-1 overflow-y-auto px-2 py-4 space-y-4'>
                        {messages.map((m, i) => (
                            <div key={i} className={`max-w-[85%] ${m.role === 'user' ? "ml-auto" : "mr-auto"}
                `}>
                                <div className={`px-8 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border-white/10 text-zinc-200"
                                    }`}>
                                    {
                                        
                                        m.content
                                    }
                                </div>
                            </div>
                        ))}

                        {updateLoading && 
                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>
                                    {
                                        thinkingSteps[thinkingIndex]
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <div className='p-3 border-t border-white/10 bg-black/60 backdrop-blur'>
                        <div className='flex items-end gap-2'>

                            <input
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && prompt.trim()) {
                                        e.preventDefault() // prevent form submit / newline
                                        handleUpdate()
                                    }
                                }}
                                value={prompt}
                                placeholder='Describe changes...'
                                className='flex-1 resize-none rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/40 transition'
                            />

                            <button
                                onClick={handleUpdate}
                                disabled={updateLoading}
                                className='h-11 w-11 flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:scale-105 active:scale-95 transition'>
                                <Send size={16} />
                            </button>

                        </div>
                    </div>
                </>
            </aside>
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-xs text-zinc-400'>Live Preview</span>
                    <div className='flex gap-2'>
                        {!website.deployed ? (<button onClick={()=>handleDeploy(website?._id)} className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'>
                            <Rocket size={14} />
                            Deploy
                        </button>):( <button onClick={(e)=>handleShare(e,website._id)} className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/10 text-sm font-semibold hover:scale-105 transition'><Share2/> Share link</button>)}
                        
                        <button onClick={()=>setShowChat(true)} className='p-2 lg:hidden'><MessageSquare size={18}/></button>
                        <button onClick={()=>setShowCode(!showCode)} className='p-2'><Code2 size={18} /></button>
                        <button className='p-2' onClick={()=>setShowFullPreview(true)}><Monitor size={18} /></button>
                    </div>
                </div>
                <iframe ref={iframeRef}  sandbox='allow-scripts allow-origin allow-forms' className='flex-1 w-full bg-white' />
            </div>

            <AnimatePresence>
                {
                    showCode && (<motion.div
                        initial={{x:"100%"}}
                        animate={{x:0}}
                        exit={{x:"100%"}}
                        className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col'
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={()=>setShowCode(false)}><X size={18}/></button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            value={code}
                            language='html'
                            options={{
                                wordWrap: "on",
                                minimap: { enabled: false } // ✅ FIX
                            }}
                            onChange={(v)=>setCode(v)}
                            />
                    </motion.div>)
                }
            </AnimatePresence>


            <AnimatePresence>
                {
                    showFullPreview && (
                        <motion.div className='fixed inset-0 z-[9999] bg-black'>
                            <iframe  sandbox='allow-scripts allow-origin allow-forms' className='w-full h-full bg-white ' srcDoc={code} />
                            <button onClick={()=>setShowFullPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg'><X size={18}/></button>
                        </motion.div>
                    )
                }
            </AnimatePresence>

            <AnimatePresence>
                {showChat && 
                    <motion.div
                        initial={{y:"100%"}}
                        animate={{y:0}}
                        exit={{y:"100%"}}
                        className='fixed inset-0 z-[9999] bg-black flex flex-col'
                    >
                        <Header/>
                        <>
                    <div className='flex-1 overflow-y-auto px-2 py-4 space-y-4'>
                        {messages.map((m, i) => (
                            <div key={i} className={`max-w-[85%] ${m.role === 'user' ? "ml-auto" : "mr-auto"}
                `}>
                                <div className={`px-8 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border-white/10 text-zinc-200"
                                    }`}>
                                    {
                                        m.content
                                    }
                                </div>
                            </div>
                        ))}

                        {updateLoading && 
                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>
                                    {
                                        thinkingSteps[thinkingIndex]
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <div className='p-3 border-t border-white/10 bg-black/60 backdrop-blur'>
                        <div className='flex items-end gap-2'>

                            <input
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && prompt.trim()) {
                                        e.preventDefault() // prevent form submit / newline
                                        handleUpdate()
                                    }
                                }}
                                value={prompt}
                                placeholder='Describe changes...'
                                className='flex-1 resize-none rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-purple-500/40 transition'
                            />

                            <button
                                onClick={handleUpdate}
                                disabled={updateLoading}
                                className='h-11 w-11 flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:scale-105 active:scale-95 transition'>
                                <Send size={16} />
                            </button>

                        </div>
                    </div>
                </>
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )

    function Header() {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10 gap-4'>
                <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={()=>navigate("/dashboard")}>
                                    <ArrowLeft size={16}/>
                                </button>
                <span className='font-semibold trancate'>{website.title}</span>
                <button onClick={()=>setShowChat(false)} className='lg:hidden'><X size={18}/></button>
            </div>
        )
    }
}

export default WebEditor
