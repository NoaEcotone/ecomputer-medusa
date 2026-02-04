import { Container, Heading, Badge, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const RentalDetailPage = () => {
  const { id } = useParams()
  const [contract, setContract] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    // Fetch rental contract details
    fetch(`/admin/rental-contracts/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setContract(data.rental_contract)
        setItems(data.contract_items || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching rental contract:", error)
        setLoading(false)
      })
  }, [id])

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, "green" | "yellow" | "red" | "grey"> = {
      actief: "green",
      in_afwachting: "yellow",
      eindigt_binnenkort: "yellow",
      beëindigd: "grey",
      geannuleerd: "red",
    }

    return (
      <Badge color={statusColors[status] || "grey"} size="large">
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  if (loading) {
    return (
      <Container>
        <div className="px-6 py-4">
          <p>Laden...</p>
        </div>
      </Container>
    )
  }

  if (!contract) {
    return (
      <Container>
        <div className="px-6 py-4">
          <p>Contract niet gevonden.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <Heading level="h1">Contract {contract.contract_number}</Heading>
          <p className="text-gray-500 mt-1">
            Aangemaakt op {formatDate(contract.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(contract.status)}
          <Badge color={contract.type === "flex" ? "blue" : contract.type === "jaar" ? "purple" : "orange"} size="large">
            {contract.type.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Contract Details */}
      <div className="px-6 py-4 space-y-6">
        {/* Basis Informatie */}
        <div>
          <Heading level="h2" className="mb-4">Basis Informatie</Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Klant ID</p>
              <p className="font-medium">{contract.customer_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium capitalize">{contract.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Startdatum</p>
              <p className="font-medium">{formatDate(contract.start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Einddatum</p>
              <p className="font-medium">{formatDate(contract.end_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vroegst mogelijke einddatum</p>
              <p className="font-medium">{formatDate(contract.earliest_end_date)}</p>
            </div>
          </div>
        </div>

        {/* Financiële Informatie */}
        <div>
          <Heading level="h2" className="mb-4">Financiële Informatie</Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Maandbedrag</p>
              <p className="font-medium text-lg">{formatCurrency(contract.monthly_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Borgbedrag</p>
              <p className="font-medium text-lg">{formatCurrency(contract.deposit_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Borg Status</p>
              <div className="flex gap-2 mt-1">
                {contract.deposit_paid && <Badge color="green">Betaald</Badge>}
                {contract.deposit_refunded && <Badge color="blue">Terugbetaald</Badge>}
                {!contract.deposit_paid && !contract.deposit_refunded && <Badge color="yellow">Openstaand</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Contract Items */}
        {items.length > 0 && (
          <div>
            <Heading level="h2" className="mb-4">Gehuurde Items</Heading>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Product ID</Table.HeaderCell>
                  <Table.HeaderCell>Aantal</Table.HeaderCell>
                  <Table.HeaderCell>Serienummer</Table.HeaderCell>
                  <Table.HeaderCell>Conditie bij levering</Table.HeaderCell>
                  <Table.HeaderCell>Conditie bij retour</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.product_id}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>{item.serial_number || "-"}</Table.Cell>
                    <Table.Cell>{item.condition_on_delivery || "-"}</Table.Cell>
                    <Table.Cell>{item.condition_on_return || "-"}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}

        {/* Notities */}
        {contract.notes && (
          <div>
            <Heading level="h2" className="mb-4">Notities</Heading>
            <div className="bg-gray-50 p-4 rounded">
              <p className="whitespace-pre-wrap">{contract.notes}</p>
            </div>
          </div>
        )}

        {/* Acties */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              // TODO: Implement edit functionality
              alert("Bewerken functionaliteit komt binnenkort")
            }}
          >
            Bewerken
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              // TODO: Implement return registration
              window.location.href = `/app/rentals/${id}/return`
            }}
          >
            Retour Registreren
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              window.location.href = "/app/rentals"
            }}
          >
            Terug naar Overzicht
          </button>
        </div>
      </div>
    </Container>
  )
}

export default RentalDetailPage
