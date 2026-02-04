import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import { Container, Heading, Table, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

const RentalsPage = () => {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch rental contracts from API
    fetch("/admin/rental-contracts", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setContracts(data.rental_contracts || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching rental contracts:", error)
        setLoading(false)
      })
  }, [])

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, "green" | "yellow" | "red" | "grey"> = {
      actief: "green",
      in_afwachting: "yellow",
      eindigt_binnenkort: "yellow",
      beëindigd: "grey",
      geannuleerd: "red",
    }

    return (
      <Badge color={statusColors[status] || "grey"}>
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, "blue" | "purple" | "orange"> = {
      flex: "blue",
      jaar: "purple",
      offerte: "orange",
    }

    return (
      <Badge color={typeColors[type] || "blue"}>
        {type.toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("nl-NL")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <Container>
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Verhuurcontracten</Heading>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            window.location.href = "/app/rentals/new"
          }}
        >
          Nieuw Contract
        </button>
      </div>

      {loading ? (
        <div className="px-6 py-4">
          <p>Laden...</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="px-6 py-4">
          <p>Geen contracten gevonden.</p>
        </div>
      ) : (
        <div className="px-6">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Contractnummer</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Startdatum</Table.HeaderCell>
                <Table.HeaderCell>Einddatum</Table.HeaderCell>
                <Table.HeaderCell>Maandbedrag</Table.HeaderCell>
                <Table.HeaderCell>Borg</Table.HeaderCell>
                <Table.HeaderCell>Acties</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contracts.map((contract) => (
                <Table.Row
                  key={contract.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    window.location.href = `/app/rentals/${contract.id}`
                  }}
                >
                  <Table.Cell>{contract.contract_number}</Table.Cell>
                  <Table.Cell>{getTypeBadge(contract.type)}</Table.Cell>
                  <Table.Cell>{getStatusBadge(contract.status)}</Table.Cell>
                  <Table.Cell>{formatDate(contract.start_date)}</Table.Cell>
                  <Table.Cell>{formatDate(contract.end_date)}</Table.Cell>
                  <Table.Cell>{formatCurrency(contract.monthly_amount)}</Table.Cell>
                  <Table.Cell>
                    {formatCurrency(contract.deposit_amount)}
                    {contract.deposit_paid && (
                      <Badge color="green" className="ml-2">Betaald</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/app/rentals/${contract.id}`
                      }}
                    >
                      Details
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Verhuur",
  icon: DocumentText,
  rank: 3,
})

export default RentalsPage
