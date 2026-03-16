import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Bell } from "lucide-react"

interface UserHeaderProps {
  name: string
  group: string
  eventName: string
  date: string
}

export function UserHeader({ name, group, eventName, date }: UserHeaderProps) {
  return (
    <header className="flex flex-col gap-5 px-5 pt-6 pb-2 lg:px-0 lg:pt-0 lg:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <Avatar className="size-11 bg-accent lg:size-14">
            <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-base lg:text-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-lg font-semibold text-foreground leading-tight lg:text-xl">
              {name}
            </h1>
          </div>
        </div>
        <button
          className="relative flex items-center justify-center size-10 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2.5 size-2 rounded-full bg-accent" />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {eventName}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <span>{date}</span>
          </div>
        </div>
        <Badge className="bg-accent/15 text-accent border-accent/25 font-semibold text-xs px-3 py-1">
          Group {group}
        </Badge>
      </div>
    </header>
  )
}
