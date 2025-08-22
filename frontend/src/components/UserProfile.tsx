import { useEffect, useState, useContext } from "react"
import { useUser } from "@/context/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Edit2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Helper to get JWT token from localStorage (or context)
function getToken() {
  return localStorage.getItem('token');
}

interface UserProfileProps {
  user?: {
    id?: string
    name: string
    email?: string
    avatar?: string
    status?: string
    title?: string
    department?: string
    bio?: string
    phone?: string
    location?: string
  }
  trigger?: React.ReactNode
  isEditable?: boolean
}

export function UserProfile({ user, trigger, isEditable }: UserProfileProps) {
  // Removed mock user logic
  
    // Helper to get JWT token from localStorage (or context)
    function getToken() {
      return localStorage.getItem('token');
    }

  const { user: loggedInUser, setUser: setLoggedInUser } = useUser();
    const [profileUser, setProfileUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      displayName: "",
      email: "",
      avatar: "",
      bio: "",
    });
    const { toast } = useToast();

    // Get logged-in user ID from JWT
    function getUserIdFromToken() {
      const token = getToken();
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch {
        return null;
      }
    }

    useEffect(() => {
      // Always fetch real profile after login and save to context
      const token = getToken();
      if (!token) return;
      fetch('http://localhost:3001/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setProfileUser(data.user);
            setEditData({
              displayName: data.user.displayName || data.user.name || "",
              email: data.user.email || "",
              avatar: data.user.avatar || "",
              bio: data.user.bio || "",
            });
            setLoggedInUser && setLoggedInUser(data.user); // update global user context
          } else {
            setProfileUser({});
            setEditData({
              displayName: "",
              email: "",
              avatar: "",
              bio: "",
            });
          }
        })
        .catch(() => {
          setProfileUser({});
          setEditData({
            displayName: "",
            email: "",
            avatar: "",
            bio: "",
          });
        });
    }, []);
  
  // Only one toast declaration

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3001/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setProfileUser(data.user);
        setEditData({
          displayName: data.user.displayName || data.user.name || "",
          email: data.user.email || "",
          avatar: data.user.avatar || "",
          bio: data.user.bio || "",
        });
        setLoggedInUser && setLoggedInUser(data.user);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile."
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again."
      });
    }
  };

  const handleCancel = () => {
    setEditData({
  displayName: profileUser?.name || "",
      email: profileUser?.email || "",
      avatar: profileUser?.avatar || "",
      bio: profileUser?.bio || "",
    });
    setIsEditing(false);
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <User className="h-4 w-4" />
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Profile
            {/* Only show edit button if viewing own profile */}
            {!isEditing && profileUser?.id === getUserIdFromToken() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 w-8 p-0"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-20 h-20">
              <AvatarImage src={editData.avatar || profileUser?.avatar} alt={editData.displayName || profileUser?.name} />
              <AvatarFallback>{(editData.displayName || profileUser?.name || '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              {isEditing ? (
                <Input
                  value={editData.displayName}
                  onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                  className="text-center font-semibold"
                />
              ) : (
                <h3 className="font-semibold text-lg">{profileUser?.name}</h3>
              )}
            </div>
            {/* Profile details */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm mt-1">{profileUser?.email || "Not provided"}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm mt-1">{profileUser?.bio || "No bio provided"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}