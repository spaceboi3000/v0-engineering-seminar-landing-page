import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

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
          <Avatar className="size-11 bg-gradient-to-br from-red-600 to-rose-500 lg:size-14 shadow-md shadow-red-500/20">
            <AvatarFallback className="bg-transparent text-white font-semibold text-base lg:text-lg">
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
        {/* Badge hat jetzt einen kräftigen Verlauf und reinweiße Schrift */}
        <Badge className="bg-gradient-to-r from-red-600 to-rose-500 border-none text-white font-semibold text-xs px-3 py-1 shadow-sm shadow-red-500/20">
          Group {group}
        </Badge>
      </div>
    </header>
  )
}