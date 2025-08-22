import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  HelpCircle, 
  Users, 
  Shield, 
  Palette, 
  Download,
  LogOut,
  User
} from "lucide-react"
import { UserProfile } from "@/components/UserProfile"
import { useUser } from "@/context/UserContext"

const menuItems = [
  {
    title: "Preferences",
    description: "Notifications, themes, and more",
    icon: Settings,
    action: () => console.log("Open preferences")
  },
  {
    title: "Invite people",
    description: "Add teammates to your workspace",
    icon: Users,
    action: () => console.log("Invite people")
  },
  {
    title: "Privacy & Security",
    description: "Manage your privacy settings",
    icon: Shield,
    action: () => console.log("Open privacy settings")
  },
  {
    title: "Themes",
    description: "Customize your workspace appearance",
    icon: Palette,
    action: () => console.log("Open themes")
  },
  {
    title: "Download apps",
    description: "Get the mobile and desktop apps",
    icon: Download,
    action: () => console.log("Download apps")
  },
  {
    title: "Help",
    description: "Get help and support",
    icon: HelpCircle,
    action: () => console.log("Open help")
  }
]

export default function More() {
  const { user, signOut } = useUser();
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">More</h1>

        {/* Profile Section */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Your Profile</h3>
                <p className="text-sm text-muted-foreground">Manage your profile information</p>
              </div>
            </div>
            <UserProfile user={user ? {
              id: user.id,
              name: user.displayName,
              email: user.email,
              avatar: undefined,
              status: undefined,
              title: undefined,
              department: undefined,
              bio: undefined,
              phone: undefined,
              location: undefined
            } : undefined} isEditable={true} trigger={
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            } />
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => (
            <Card key={item.title} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <button 
                onClick={item.action}
                className="w-full flex items-center gap-3 text-left"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </button>
            </Card>
          ))}
        </div>

        {/* Sign Out */}
        <Card className="p-4">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 text-left text-destructive hover:bg-destructive/10 rounded p-2 -m-2 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <div>
              <h3 className="font-medium text-sm">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
          </button>
        </Card>
      </div>
    </div>
  );
}