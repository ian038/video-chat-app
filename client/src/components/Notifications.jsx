import React from 'react'
import { Button } from '@material-ui/core'
import { useVideoCallContext } from '../SocketContext'

const Notifications = () => {
    const { call, answerCall, callAccepted } = useVideoCallContext()

    return (
        <>
            {call.isReceivingCall && !callAccepted && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>{call.name} is calling: </h1>
                    <Button variant='contained' color='primary' onClick={answerCall}>
                        Answer
                    </Button>
                </div>
            )}
        </>
    )
}

export default Notifications
