import { Button, toast, DropdownMenu } from "@medusajs/ui"
import { EllipsisHorizontal } from "@medusajs/icons"
import { useState } from "react"

interface QuoteRequestActionsProps {
  quoteRequestId: string
  currentStatus: string
  onSuccess: () => void
}

export const QuoteRequestActions = ({ 
  quoteRequestId, 
  currentStatus, 
  onSuccess 
}: QuoteRequestActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const deleteQuoteRequest = async () => {
    if (!confirm("Weet je zeker dat je deze offerte-aanvraag wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
      return
    }

    setIsUpdating(true)
    
    try {
      const response = await fetch(`/admin/quote-requests/${quoteRequestId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete quote request")
      }

      toast.success("Offerte-aanvraag verwijderd", {
        description: "De offerte-aanvraag is succesvol verwijderd",
      })

      onSuccess()
    } catch (error) {
      console.error("Error deleting quote request:", error)
      toast.error("Fout bij verwijderen", {
        description: "Er is een fout opgetreden bij het verwijderen van de offerte-aanvraag",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const updateStatus = async (newStatus: string, confirmMessage?: string) => {
    if (confirmMessage && !confirm(confirmMessage)) {
      return
    }

    console.log("[DEBUG] Updating quote request:", {
      quoteRequestId,
      newStatus,
      url: `/admin/quote-requests/${quoteRequestId}`
    })

    setIsUpdating(true)
    
    try {
      const response = await fetch(`/admin/quote-requests/${quoteRequestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update quote request status")
      }

      const statusLabels: Record<string, string> = {
        nieuw: "Nieuw",
        in_behandeling: "In Behandeling",
        offerte_verstuurd: "Offerte Verstuurd",
        geaccepteerd: "Geaccepteerd",
        afgewezen: "Afgewezen",
      }

      toast.success("Status bijgewerkt", {
        description: `Status is gewijzigd naar: ${statusLabels[newStatus] || newStatus}`,
      })

      onSuccess()
    } catch (error) {
      console.error("Error updating quote request status:", error)
      toast.error("Fout bij bijwerken", {
        description: "Er is een fout opgetreden bij het bijwerken van de status",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Determine which actions are available based on current status
  const canAccept = ["nieuw", "in_behandeling", "offerte_verstuurd"].includes(currentStatus)
  const canReject = ["nieuw", "in_behandeling", "offerte_verstuurd"].includes(currentStatus)
  const canMarkInProgress = currentStatus === "nieuw"
  const canMarkQuoteSent = ["nieuw", "in_behandeling"].includes(currentStatus)

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {/* Quick Actions for common statuses */}
      {currentStatus === "nieuw" && (
        <>
          <Button
            size="small"
            variant="secondary"
            onClick={() => updateStatus("in_behandeling")}
            disabled={isUpdating}
          >
            In Behandeling
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={() => updateStatus("geaccepteerd")}
            disabled={isUpdating}
          >
            Accepteren
          </Button>
        </>
      )}

      {currentStatus === "in_behandeling" && (
        <>
          <Button
            size="small"
            variant="secondary"
            onClick={() => updateStatus("offerte_verstuurd")}
            disabled={isUpdating}
          >
            Offerte Verstuurd
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={() => updateStatus("geaccepteerd")}
            disabled={isUpdating}
          >
            Accepteren
          </Button>
        </>
      )}

      {currentStatus === "offerte_verstuurd" && (
        <>
          <Button
            size="small"
            variant="primary"
            onClick={() => updateStatus("geaccepteerd")}
            disabled={isUpdating}
          >
            Accepteren
          </Button>
        </>
      )}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            size="small"
            variant="transparent"
            disabled={isUpdating}
          >
            <EllipsisHorizontal />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {canMarkInProgress && (
            <DropdownMenu.Item
              onClick={() => updateStatus("in_behandeling")}
            >
              Markeer als In Behandeling
            </DropdownMenu.Item>
          )}
          
          {canMarkQuoteSent && (
            <DropdownMenu.Item
              onClick={() => updateStatus("offerte_verstuurd")}
            >
              Markeer als Offerte Verstuurd
            </DropdownMenu.Item>
          )}
          
          {canAccept && (
            <DropdownMenu.Item
              onClick={() => updateStatus("geaccepteerd")}
            >
              Accepteren
            </DropdownMenu.Item>
          )}
          
          {canReject && (
            <DropdownMenu.Item
              onClick={() => updateStatus(
                "afgewezen",
                "Weet je zeker dat je deze offerte-aanvraag wilt afwijzen?"
              )}
            >
              <span className="text-red-600">Afwijzen</span>
            </DropdownMenu.Item>
          )}

          {["geaccepteerd", "afgewezen"].includes(currentStatus) && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onClick={() => updateStatus("nieuw")}
              >
                Terugzetten naar Nieuw
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Separator />
          <DropdownMenu.Item
            onClick={deleteQuoteRequest}
          >
            <span className="text-red-600">Verwijderen</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}
