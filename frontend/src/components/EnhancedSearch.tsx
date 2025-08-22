import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Hash, User, Clock, Filter } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface SearchResult {
  id: string
  type: 'channel' | 'user' | 'message'
  title: string
  subtitle?: string
  avatar?: string
  timestamp?: string
}

interface EnhancedSearchProps {
  onResultSelect?: (result: SearchResult) => void
}

export function EnhancedSearch({ onResultSelect }: EnhancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")

  const mockResults: SearchResult[] = [
    {
      id: 'channel-1',
      type: 'channel',
      title: 'Log Rocket Group',
      subtitle: '9 members',
    },
    {
      id: 'user-1',
      type: 'user',
      title: 'Muhammad Salman',
      subtitle: 'Online',
      avatar: '/src/assets/user-avatar-1.png'
    },
    {
      id: 'user-2',
      type: 'user',
      title: 'Fahad Jalal',
      subtitle: 'Away',
      avatar: '/src/assets/user-avatar-2.png'
    },
    {
      id: 'message-1',
      type: 'message',
      title: 'search bar experience',
      subtitle: 'in Log Rocket Group',
      timestamp: '2 hours ago'
    }
  ]

  const filteredResults = query ? mockResults.filter(result => 
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.subtitle?.toLowerCase().includes(query.toLowerCase())
  ) : mockResults

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery("")
    onResultSelect?.(result)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search QLU Recruiting"
            className="pl-10 h-9 border-border bg-muted/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0">
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Channels">
              {filteredResults
                .filter(result => result.type === 'channel')
                .map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 p-3"
                  >
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                      )}
                    </div>
                  </CommandItem>
                ))
              }
            </CommandGroup>

            <CommandGroup heading="People">
              {filteredResults
                .filter(result => result.type === 'user')
                .map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 p-3"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={result.avatar} />
                      <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                      )}
                    </div>
                  </CommandItem>
                ))
              }
            </CommandGroup>

            <CommandGroup heading="Messages">
              {filteredResults
                .filter(result => result.type === 'message')
                .map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 p-3"
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        {result.subtitle}
                        {result.timestamp && (
                          <>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            {result.timestamp}
                          </>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}