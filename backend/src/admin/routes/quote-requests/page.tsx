import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentSeries } from "@medusajs/icons"
import { Container, Heading, Table, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { QuoteRequestActions } from "../../components/quote-request-actions"

const QuoteRequestsPage = () => {
  const [quoteRequests, setQuoteRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  const fetchQuoteRequests = () => {
    setLoading(true)
    const url = filter === "all" 
      ? "/admin/quote-requests"
      : `/admin/quote-requests?status=${filter}`

    fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setQuoteRequests(data.quote_requests || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching quote requests:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchQuoteRequests()
  }, [filter])

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, "green" | "yellow" | "blue" | "red" | "grey"> = {
      nieuw: "blue",
      in_behandeling: "yellow",
      offerte_verstuurd: "purple",
      geaccepteerd: "green",
      afgewezen: "red",
    }

    const statusLabels: Record<string, string> = {
      nieuw: "Nieuw",
      in_behandeling: "In Behandeling",
      offerte_verstuurd: "Offerte Verstuurd",
      geaccepteerd: "Geaccepteerd",
      afgewezen: "Afgewezen",
    }

    return (
      <Badge color={statusColors[status] || "grey"}>
        {statusLabels[status] || status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("nl-NL")
  }

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "-"
    const startDate = new Date(start)
    const endDate = new Date(end)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days < 7) return `${days} dagen`
    if (days < 30) return `${Math.ceil(days / 7)} weken`
    return `${Math.ceil(days / 30)} maanden`
  }

  return (
    <Container>
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Offerte Aanvragen</Heading>
        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Alle statussen</option>
            <option value="nieuw">Nieuw</option>
            <option value="in_behandeling">In Behandeling</option>
            <option value="offerte_verstuurd">Offerte Verstuurd</option>
            <option value="geaccepteerd">Geaccepteerd</option>
            <option value="afgewezen">Afgewezen</option>
          </select>
        </div>
      </div>

      <div className="px-6 py-4">
        <p className="text-gray-600 mb-4">
          Beheer offerte-aanvragen voor korte termijn verhuur (1 dag tot 4 weken). 
          Deze aanvragen komen binnen via het aanvraagformulier op de website.
        </p>
      </div>

      {loading ? (
        <div className="px-6 py-4">
          <p>Laden...</p>
        </div>
      ) : quoteRequests.length === 0 ? (
        <div className="px-6 py-4">
          <p>Geen offerte-aanvragen gevonden{filter !== "all" ? ` met status "${filter}"` : ""}.</p>
        </div>
      ) : (
        <div className="px-6">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Bedrijf</Table.HeaderCell>
                <Table.HeaderCell>Contactpersoon</Table.HeaderCell>
                <Table.HeaderCell>E-mail</Table.HeaderCell>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Duur</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Aangemaakt</Table.HeaderCell>
                <Table.HeaderCell>Acties</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {quoteRequests.map((request) => (
                <Table.Row
                  key={request.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    window.location.href = `/app/quote-requests/${request.id}`
                  }}
                >
                  <Table.Cell className="font-medium">{request.company_name}</Table.Cell>
                  <Table.Cell>{request.contact_person}</Table.Cell>
                  <Table.Cell>{request.email}</Table.Cell>
                  <Table.Cell>
                    {formatDate(request.desired_period_start)} - {formatDate(request.desired_period_end)}
                  </Table.Cell>
                  <Table.Cell>
                    {calculateDuration(request.desired_period_start, request.desired_period_end)}
                  </Table.Cell>
                  <Table.Cell>{getStatusBadge(request.status)}</Table.Cell>
                  <Table.Cell>{formatDate(request.created_at)}</Table.Cell>
                  <Table.Cell>
                    <QuoteRequestActions
                      quoteRequestId={request.id}
                      currentStatus={request.status}
                      onSuccess={fetchQuoteRequests}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Stats Section */}
      <div className="px-6 py-4 mt-4 grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Nieuw</p>
          <p className="text-2xl font-bold text-blue-600">
            {quoteRequests.filter((r) => r.status === "nieuw").length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <p className="text-sm text-gray-600">In Behandeling</p>
          <p className="text-2xl font-bold text-yellow-600">
            {quoteRequests.filter((r) => r.status === "in_behandeling").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-gray-600">Geaccepteerd</p>
          <p className="text-2xl font-bold text-green-600">
            {quoteRequests.filter((r) => r.status === "geaccepteerd").length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-sm text-gray-600">Afgewezen</p>
          <p className="text-2xl font-bold text-red-600">
            {quoteRequests.filter((r) => r.status === "afgewezen").length}
          </p>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Offerte Aanvragen",
  icon: DocumentSeries,
  rank: 5,
})

export default QuoteRequestsPage
