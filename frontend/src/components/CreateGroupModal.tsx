import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface CreateGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGroupModal({ open, onOpenChange }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState("")

  const handleSave = () => {
    // Handle group creation logic here
    console.log("Creating group:", { groupName, selectedUsers })
    onOpenChange(false)
    setGroupName("")
    setSelectedUsers("")
  }

  const handleCancel = () => {
    onOpenChange(false)
    setGroupName("")
    setSelectedUsers("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Create New Group</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-sm font-medium">
              Group Name
            </Label>
            <Input
              id="group-name"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="select-users" className="text-sm font-medium text-primary">
              Select Users
            </Label>
            <Select value={selectedUsers} onValueChange={setSelectedUsers}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Select users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">Muhammad Salman</SelectItem>
                <SelectItem value="user2">Fahad Jalal</SelectItem>
                <SelectItem value="user3">Yashua Parvez</SelectItem>
                <SelectItem value="user4">Aneeq Akber</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!groupName.trim()}
            className="bg-primary text-primary-foreground"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}