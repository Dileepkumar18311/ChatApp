import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor } from "lucide-react"

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  participant?: {
    name: string
    avatar?: string
  }
  isIncoming?: boolean
}

export function VideoCallModal({ isOpen, onClose, participant, isIncoming = false }: VideoCallModalProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isCallActive, setIsCallActive] = useState(!isIncoming)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && isVideoOn) {
      startLocalVideo()
    }
    return () => {
      stopLocalVideo()
    }
  }, [isOpen, isVideoOn])

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: !isMuted 
      })
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopLocalVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      localVideoRef.current.srcObject = null
    }
  }

  const handleAnswer = () => {
    setIsCallActive(true)
  }

  const handleEndCall = () => {
    stopLocalVideo()
    setIsCallActive(false)
    onClose()
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setIsScreenSharing(true)
      } catch (error) {
        console.error("Error sharing screen:", error)
      }
    } else {
      startLocalVideo()
      setIsScreenSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={participant?.avatar} />
                <AvatarFallback>{participant?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {participant?.name}
              {isIncoming && !isCallActive && (
                <span className="text-sm text-muted-foreground">- Incoming call</span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Video Area */}
          <div className="flex-1 relative bg-muted">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video */}
            <div className="absolute bottom-4 right-4 w-48 h-32 rounded-lg overflow-hidden bg-card border border-border">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/src/assets/user-avatar-1.png" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            {/* Call Status */}
            {!isCallActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={participant?.avatar} />
                    <AvatarFallback>{participant?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-2">{participant?.name}</h3>
                  <p className="text-muted-foreground">
                    {isIncoming ? "Incoming video call..." : "Calling..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-center gap-4">
              {isIncoming && !isCallActive ? (
                <>
                  <Button
                    onClick={handleAnswer}
                    size="lg"
                    className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleEndCall}
                    size="lg"
                    variant="destructive"
                    className="rounded-full h-12 w-12"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={toggleMute}
                    size="lg"
                    variant={isMuted ? "destructive" : "secondary"}
                    className="rounded-full h-12 w-12"
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    onClick={toggleVideo}
                    size="lg"
                    variant={!isVideoOn ? "destructive" : "secondary"}
                    className="rounded-full h-12 w-12"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    onClick={toggleScreenShare}
                    size="lg"
                    variant={isScreenSharing ? "default" : "secondary"}
                    className="rounded-full h-12 w-12"
                  >
                    <Monitor className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    onClick={handleEndCall}
                    size="lg"
                    variant="destructive"
                    className="rounded-full h-12 w-12"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}