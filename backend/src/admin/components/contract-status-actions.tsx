import { Button, DropdownMenu, toast } from "@medusajs/ui"
import { EllipsisHorizontal } from "@medusajs/icons"
import { useState } from "react"

interface ContractStatusActionsProps {
  contract: any
  onUpdate: () => void
}

export const ContractStatusActions = ({
  contract,
  onUpdate,
}: ContractStatusActionsProps) => {
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setLoading(true)

    try {
      const response = await fetch(`/admin/rental-contracts/${contract.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update contract status")
      }

      toast.success("Status bijgewerkt", {
        description: `Contract status is gewijzigd naar ${newStatus}`,
      })

      onUpdate()
    } catch (error) {
      console.error("Error updating contract status:", error)
      toast.error("Fout", {
        description: "Er is een fout opgetreden bij het bijwerken van de status",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Weet je zeker dat je dit contract wilt annuleren?")) {
      return
    }
    await updateStatus("geannuleerd")
  }

  const handleTerminate = async () => {
    if (!confirm("Weet je zeker dat je dit contract wilt beëindigen?")) {
      return
    }
    await updateStatus("beëindigd")
  }

  // Context-aware buttons based on current status
  const renderPrimaryActions = () => {
    switch (contract.status) {
      case "in_afwachting":
        return (
          <>
            <Button
              size="small"
              onClick={() => updateStatus("actief")}
              disabled={loading}
            >
              Activeren
            </Button>
          </>
        )
      case "actief":
        return (
          <>
            <Button
              size="small"
              variant="secondary"
              onClick={() => updateStatus("eindigt_binnenkort")}
              disabled={loading}
            >
              Markeer als Eindigt Binnenkort
            </Button>
          </>
        )
      case "eindigt_binnenkort":
        return (
          <>
            <Button
              size="small"
              onClick={handleTerminate}
              disabled={loading}
            >
              Beëindigen
            </Button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {renderPrimaryActions()}

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="small" variant="transparent">
            <EllipsisHorizontal />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {contract.status !== "in_afwachting" && (
            <DropdownMenu.Item onClick={() => updateStatus("in_afwachting")}>
              Terugzetten naar In Afwachting
            </DropdownMenu.Item>
          )}
          {contract.status !== "actief" && contract.status !== "beëindigd" && contract.status !== "geannuleerd" && (
            <DropdownMenu.Item onClick={() => updateStatus("actief")}>
              Activeren
            </DropdownMenu.Item>
          )}
          {contract.status !== "eindigt_binnenkort" && contract.status !== "beëindigd" && contract.status !== "geannuleerd" && (
            <DropdownMenu.Item onClick={() => updateStatus("eindigt_binnenkort")}>
              Markeer als Eindigt Binnenkort
            </DropdownMenu.Item>
          )}
          {contract.status !== "beëindigd" && contract.status !== "geannuleerd" && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={handleTerminate}>
                Beëindigen
              </DropdownMenu.Item>
            </>
          )}
          {contract.status !== "geannuleerd" && (
            <DropdownMenu.Item onClick={handleCancel} className="text-red-500">
              Annuleren
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}
