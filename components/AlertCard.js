import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertCard({remaining}) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{remaining} urls are left to be collected</AlertTitle>
    </Alert>
  )
}
