import { createContext, useContext, useState, useRef, useEffect } from "react";
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext()

const socket = io('https://realtime-video-chat-app-server.herokuapp.com/')

function useProvideContext() {
    const [stream, setStream] = useState(null)
    const [me, setMe] = useState('')
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')
    const myVideo = useRef(null)
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                setStream(currentStream)
                myVideo.current.srcObject = currentStream
            } catch (error) {
                console.log(error)
            }
        }
        getUserMedia()
        socket.on('me', id => setMe(id))

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal  })
        })
    }, [])

    const answerCall = () => {
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal', data => {
            socket.emit('answerCall', { signal: data, to: call.from })
        })
        peer.on('stream', currentStream => {
            userVideo.current.srcObject = currentStream
        })
        peer.signal(call.signal)
        connectionRef.current = peer
    }

    const callUser = id => {
        const peer = new Peer({ initiator: true, trickle: false, stream })
        peer.on('signal', data => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
        })
        peer.on('stream', currentStream => {
            userVideo.current.srcObject = currentStream
        })
        socket.on('callAccepted', signal => {
            setCallAccepted(true)
            peer.signal(signal)
        })
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
        window.location.reload()
    }
    return {
        call,
        callAccepted,
        callEnded,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        me,
        answerCall,
        callUser, 
        leaveCall
    }
}

export const ContextProvider = ({ children }) => {
    const videoCall = useProvideContext()
    return <SocketContext.Provider value={videoCall}>{children}</SocketContext.Provider>
}

export const useVideoCallContext = () => useContext(SocketContext)