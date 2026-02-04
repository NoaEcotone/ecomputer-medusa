import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CurrencyDollar } from "@medusajs/icons"
import { Container, Heading, Table, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

const RentalPricingPage = () => {
  const [pricings, setPricings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch rental pricings from API
    fetch("/admin/rental-pricing", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPricings(data.rental_pricings || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching rental pricings:", error)
        setLoading(false)
      })
  }, [])

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  return (
    <Container>
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Verhuurprijzen</Heading>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            // TODO: Implement add pricing modal
            alert("Nieuwe pricing toevoegen komt binnenkort")
          }}
        >
          Nieuwe Pricing
        </button>
      </div>

      <div className="px-6 py-4">
        <p className="text-gray-600 mb-4">
          Beheer verhuurprijzen per product. Stel Flex (maandelijks) en Jaar (12 maanden) prijzen in, 
          plus het borgbedrag.
        </p>
      </div>

      {loading ? (
        <div className="px-6 py-4">
          <p>Laden...</p>
        </div>
      ) : pricings.length === 0 ? (
        <div className="px-6 py-4">
          <p>Geen verhuurprijzen gevonden. Voeg een nieuwe pricing toe om te beginnen.</p>
        </div>
      ) : (
        <div className="px-6">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Product ID</Table.HeaderCell>
                <Table.HeaderCell>Flex (maandelijks)</Table.HeaderCell>
                <Table.HeaderCell>Jaar (12 maanden)</Table.HeaderCell>
                <Table.HeaderCell>Borgbedrag</Table.HeaderCell>
                <Table.HeaderCell>Beschikbaarheid</Table.HeaderCell>
                <Table.HeaderCell>Acties</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pricings.map((pricing) => (
                <Table.Row key={pricing.id}>
                  <Table.Cell className="font-medium">{pricing.product_id}</Table.Cell>
                  <Table.Cell>
                    {formatCurrency(pricing.flex_monthly_price)}
                    {pricing.flex_available && (
                      <Badge color="green" className="ml-2">Actief</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {formatCurrency(pricing.year_monthly_price)}
                    {pricing.year_available && (
                      <Badge color="green" className="ml-2">Actief</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(pricing.deposit_amount)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1">
                      {pricing.flex_available && <Badge color="blue">Flex</Badge>}
                      {pricing.year_available && <Badge color="purple">Jaar</Badge>}
                      {!pricing.flex_available && !pricing.year_available && (
                        <Badge color="red">Niet beschikbaar</Badge>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        alert("Bewerken komt binnenkort")
                      }}
                    >
                      Bewerken
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (confirm("Weet je zeker dat je deze pricing wilt verwijderen?")) {
                          fetch(`/admin/rental-pricing/${pricing.id}`, {
                            method: "DELETE",
                            credentials: "include",
                          })
                            .then(() => {
                              setPricings(pricings.filter((p) => p.id !== pricing.id))
                            })
                            .catch((error) => {
                              console.error("Error deleting pricing:", error)
                              alert("Fout bij verwijderen")
                            })
                        }
                      }}
                    >
                      Verwijderen
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Info Section */}
      <div className="px-6 py-4 mt-4 bg-blue-50 rounded">
        <Heading level="h3" className="mb-2">Verhuurmodellen</Heading>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Flex (maandelijks):</strong> Minimaal 3 maanden, daarna maandelijks opzegbaar met 1 maand opzegtermijn. 
            Hogere maandprijs.
          </div>
          <div>
            <strong>Jaar (12 maanden):</strong> Vast 12 maanden contract. Lagere maandprijs door langere commitment.
          </div>
          <div>
            <strong>Borgbedrag:</strong> Eenmalig bij contractstart. Wordt terugbetaald bij inlevering in goede staat.
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Verhuurprijzen",
  icon: CurrencyDollar,
  nested: "/rentals",
  rank: 1,
})

export default RentalPricingPage
