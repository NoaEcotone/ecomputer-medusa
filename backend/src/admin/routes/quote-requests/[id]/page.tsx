import { Container, Heading, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const QuoteRequestDetailPage = () => {
  const { id } = useParams()
  const [quoteRequest, setQuoteRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    // Fetch quote request details
    fetch(`/admin/quote-requests/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setQuoteRequest(data.quote_request)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching quote request:", error)
        setLoading(false)
      })
  }, [id])

  const updateStatus = (newStatus: string) => {
    fetch(`/admin/quote-requests/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuoteRequest(data.quote_request)
        alert("Status bijgewerkt!")
      })
      .catch((error) => {
        console.error("Error updating status:", error)
        alert("Fout bij bijwerken status")
      })
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, "green" | "yellow" | "blue" | "red" | "grey"> = {
      nieuw: "blue",
      in_behandeling: "yellow",
      offerte_verstuurd: "purple",
      geaccepteerd: "green",
      afgewezen: "red",
    }

    return (
      <Badge color={statusColors[status] || "grey"} size="large">
        {status.replace("_", " ").toUpperCase()}
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

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "-"
    const startDate = new Date(start)
    const endDate = new Date(end)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days < 7) return `${days} dagen`
    if (days < 30) return `${Math.ceil(days / 7)} weken`
    return `${Math.ceil(days / 30)} maanden`
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

  if (!quoteRequest) {
    return (
      <Container>
        <div className="px-6 py-4">
          <p>Offerte-aanvraag niet gevonden.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <Heading level="h1">Offerte Aanvraag - {quoteRequest.company_name}</Heading>
          <p className="text-gray-500 mt-1">
            Aangemaakt op {formatDate(quoteRequest.created_at)}
          </p>
        </div>
        {getStatusBadge(quoteRequest.status)}
      </div>

      {/* Details */}
      <div className="px-6 py-4 space-y-6">
        {/* Bedrijfsgegevens */}
        <div>
          <Heading level="h2" className="mb-4">Bedrijfsgegevens</Heading>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bedrijfsnaam</p>
              <p className="font-medium">{quoteRequest.company_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contactpersoon</p>
              <p className="font-medium">{quoteRequest.contact_person}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">E-mail</p>
              <p className="font-medium">
                <a href={`mailto:${quoteRequest.email}`} className="text-blue-500 hover:underline">
                  {quoteRequest.email}
                </a>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefoon</p>
              <p className="font-medium">
                {quoteRequest.phone ? (
                  <a href={`tel:${quoteRequest.phone}`} className="text-blue-500 hover:underline">
                    {quoteRequest.phone}
                  </a>
                ) : (
                  "-"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Gewenste Periode */}
        <div>
          <Heading level="h2" className="mb-4">Gewenste Periode</Heading>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Startdatum</p>
              <p className="font-medium">{formatDate(quoteRequest.desired_period_start)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Einddatum</p>
              <p className="font-medium">{formatDate(quoteRequest.desired_period_end)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duur</p>
              <p className="font-medium">
                {calculateDuration(quoteRequest.desired_period_start, quoteRequest.desired_period_end)}
              </p>
            </div>
          </div>
        </div>

        {/* Gewenste Items */}
        <div>
          <Heading level="h2" className="mb-4">Gewenste Items</Heading>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {JSON.stringify(quoteRequest.requested_items, null, 2)}
            </pre>
          </div>
        </div>

        {/* Notities */}
        {quoteRequest.notes && (
          <div>
            <Heading level="h2" className="mb-4">Notities</Heading>
            <div className="bg-gray-50 p-4 rounded">
              <p className="whitespace-pre-wrap">{quoteRequest.notes}</p>
            </div>
          </div>
        )}

        {/* Status Acties */}
        <div>
          <Heading level="h2" className="mb-4">Status Bijwerken</Heading>
          <div className="flex gap-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => updateStatus("in_behandeling")}
              disabled={quoteRequest.status === "in_behandeling"}
            >
              In Behandeling
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => updateStatus("offerte_verstuurd")}
              disabled={quoteRequest.status === "offerte_verstuurd"}
            >
              Offerte Verstuurd
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => updateStatus("geaccepteerd")}
              disabled={quoteRequest.status === "geaccepteerd"}
            >
              Geaccepteerd
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => updateStatus("afgewezen")}
              disabled={quoteRequest.status === "afgewezen"}
            >
              Afgewezen
            </button>
          </div>
        </div>

        {/* Navigatie */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              window.location.href = "/app/quote-requests"
            }}
          >
            Terug naar Overzicht
          </button>
        </div>
      </div>
    </Container>
  )
}

export default QuoteRequestDetailPage
