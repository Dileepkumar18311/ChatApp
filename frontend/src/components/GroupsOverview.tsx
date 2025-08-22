import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Hash } from "lucide-react"
import { CreateGroupModal } from "./CreateGroupModal"

const groups = [
  { name: "Log Rocket Group", members: 9, description: "Development updates and discussions" },
  { name: "Random", members: 5, description: "Random conversations and fun topics" },
  { name: "HR", members: 8, description: "Human resources and company policies" },
  { name: "General", members: 12, description: "General company discussions" },
  { name: "Qlu Daily Updates", members: 15, description: "Daily standup and project updates" },
]

export function GroupsOverview() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Groups</h1>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card 
              key={group.name}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground mb-1">{group.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {group.description}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {group.members} members
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <CreateGroupModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  )
}