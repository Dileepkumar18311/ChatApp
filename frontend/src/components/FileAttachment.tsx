import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Paperclip, File, Image, Video, Mic, Folder } from "lucide-react"

interface FileAttachmentProps {
  onFileSelect?: (file: File, type: 'image' | 'video' | 'audio' | 'document') => void
}

export function FileAttachment({ onFileSelect }: FileAttachmentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileType = (type: 'image' | 'video' | 'document') => {
    setIsOpen(false)
    
    if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click()
    } else if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.click()
    } else if (type === 'document' && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio' | 'document') => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect?.(file, type)
    }
    // Reset input
    event.target.value = ''
  }

  const startVoiceRecording = () => {
    setIsOpen(false)
    // TODO: Implement voice recording
    console.log("Starting voice recording...")
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Paperclip className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleFileType('image')}
            >
              <Image className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleFileType('video')}
            >
              <Video className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleFileType('document')}
            >
              <File className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={startVoiceRecording}
            >
              <Mic className="h-4 w-4 mr-2" />
              Voice Message
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, 'video')}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, 'document')}
      />
    </>
  )
}