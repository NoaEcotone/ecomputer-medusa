import { ExecArgs } from "@medusajs/framework/types"

/**
 * Seed script voor rental module test data
 * 
 * Dit script voegt test data toe aan de rental module via directe SQL queries.
 * 
 * Gebruik: pnpm medusa exec ./src/scripts/seed-rental-data.ts
 */

export default async function seedRentalData({ container }: ExecArgs) {
  console.log("🌱 Starting rental data seeding...")

  try {
    // Get the Postgres manager from container
    const pgConnection = container.resolve("pg_connection")
    
    console.log("\n📊 Creating rental pricing...")
    
    const pricings = [
      ["prod_laptop_dell_xps_15", "flex", 89.99, 500.00, true],
      ["prod_laptop_dell_xps_15", "jaar", 69.99, 500.00, true],
      ["prod_laptop_macbook_pro_14", "flex", 129.99, 800.00, true],
      ["prod_laptop_macbook_pro_14", "jaar", 99.99, 800.00, true],
      ["prod_monitor_dell_27", "flex", 29.99, 150.00, true],
      ["prod_monitor_dell_27", "jaar", 24.99, 150.00, true],
      ["prod_docking_station", "flex", 19.99, 100.00, true],
    ]

    for (const [product_id, rental_type, monthly_price, deposit_amount, is_available] of pricings) {
      await pgConnection.query(
        `INSERT INTO rental_pricing (product_id, rental_type, monthly_price, deposit_amount, is_available, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [product_id, rental_type, monthly_price, deposit_amount, is_available]
      )
      console.log(`  ✅ Created pricing for ${product_id} (${rental_type})`)
    }

    console.log("\n📝 Creating rental contracts...")

    const contracts = [
      ["cus_01JKHW8XQZM9P2N3R4T5V6W7X8", "RC-2026-001", "flex", "actief", "2025-12-01", "2026-12-01", "2026-03-01", 89.99, 500.00, "betaald", "Eerste contract voor nieuwe klant. Levering op kantoor."],
      ["cus_02JKHW8XQZM9P2N3R4T5V6W7X9", "RC-2026-002", "jaar", "actief", "2026-01-15", "2027-01-15", "2027-01-15", 99.99, 800.00, "betaald", "MacBook Pro voor designer. Inclusief docking station."],
      ["cus_03JKHW8XQZM9P2N3R4T5V6W7Y0", "RC-2026-003", "flex", "in_afwachting", "2026-02-10", "2027-02-10", "2026-05-10", 29.99, 150.00, "openstaand", "Wacht op betaling borg voordat levering kan plaatsvinden."],
      ["cus_04JKHW8XQZM9P2N3R4T5V6W7Y1", "RC-2025-089", "jaar", "beëindigd", "2025-01-01", "2026-01-01", "2026-01-01", 69.99, 500.00, "terugbetaald", "Contract succesvol afgerond. Apparatuur in goede staat geretourneerd."],
      ["cus_05JKHW8XQZM9P2N3R4T5V6W7Y2", "RC-2026-004", "flex", "eindigt_binnenkort", "2025-11-01", "2026-02-01", "2026-02-01", 89.99, 500.00, "betaald", "Opzegtermijn loopt. Klant wil niet verlengen."],
    ]

    const createdContractIds = []
    
    for (const contract of contracts) {
      const result = await pgConnection.query(
        `INSERT INTO rental_contract (customer_id, contract_number, rental_type, status, start_date, end_date, earliest_end_date, monthly_amount, deposit_amount, deposit_status, notes, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING id`,
        contract
      )
      createdContractIds.push(result.rows[0].id)
      console.log(`  ✅ Created contract ${contract[1]} (${contract[3]})`)
    }

    console.log("\n📦 Adding items to contracts...")

    const contractItems = [
      [createdContractIds[0], "prod_laptop_dell_xps_15", 1, "DXP15-2024-A1234", "nieuw", null],
      [createdContractIds[1], "prod_laptop_macbook_pro_14", 1, "MBP14-2024-B5678", "nieuw", null],
      [createdContractIds[1], "prod_docking_station", 1, "DOCK-2024-C9012", "nieuw", null],
      [createdContractIds[2], "prod_monitor_dell_27", 2, "MON27-2024-D3456", "nieuw", null],
      [createdContractIds[3], "prod_laptop_dell_xps_15", 1, "DXP15-2023-E7890", "nieuw", "goed"],
      [createdContractIds[4], "prod_laptop_dell_xps_15", 1, "DXP15-2024-F1122", "nieuw", null],
    ]

    for (const item of contractItems) {
      await pgConnection.query(
        `INSERT INTO rental_contract_item (contract_id, product_id, quantity, serial_number, condition_at_delivery, condition_at_return, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        item
      )
      console.log(`  ✅ Added item ${item[1]} to contract`)
    }

    console.log("\n💬 Creating quote requests...")

    const quoteRequests = [
      ["Tech Startup BV", "Jan Jansen", "jan@techstartup.nl", "+31612345678", "2026-03-01", "2026-03-15", JSON.stringify([{product_id: "prod_laptop_dell_xps_15", quantity: 5}, {product_id: "prod_monitor_dell_27", quantity: 5}]), "nieuw", "Voor tijdelijk project. Levering op kantoor gewenst."],
      ["Event Company Amsterdam", "Sarah de Vries", "sarah@eventcompany.nl", "+31687654321", "2026-04-10", "2026-04-12", JSON.stringify([{product_id: "prod_laptop_macbook_pro_14", quantity: 10}, {product_id: "prod_docking_station", quantity: 10}]), "in_behandeling", "Voor conferentie. Moet 1 dag voor event geleverd worden."],
      ["Marketing Bureau Rotterdam", "Peter Bakker", "peter@marketingbureau.nl", "+31698765432", "2026-02-15", "2026-03-15", JSON.stringify([{product_id: "prod_laptop_macbook_pro_14", quantity: 3}]), "offerte_verstuurd", "Offerte verstuurd op 2026-02-01. Wacht op reactie."],
      ["Consultancy Firm Utrecht", "Lisa Vermeulen", "lisa@consultancy.nl", "+31676543210", "2026-01-20", "2026-02-20", JSON.stringify([{product_id: "prod_laptop_dell_xps_15", quantity: 2}, {product_id: "prod_monitor_dell_27", quantity: 2}, {product_id: "prod_docking_station", quantity: 2}]), "geaccepteerd", "Klant heeft offerte geaccepteerd. Contract wordt opgesteld."],
      ["Design Studio Den Haag", "Mark de Jong", "mark@designstudio.nl", "+31665432109", "2026-02-01", "2026-02-07", JSON.stringify([{product_id: "prod_laptop_macbook_pro_14", quantity: 1}]), "afgewezen", "Klant vond prijs te hoog. Geen reactie meer ontvangen."],
    ]

    for (const request of quoteRequests) {
      await pgConnection.query(
        `INSERT INTO quote_request (company_name, contact_person, email, phone, desired_start_date, desired_end_date, desired_items, status, notes, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        request
      )
      console.log(`  ✅ Created quote request for ${request[0]} (${request[7]})`)
    }

    console.log("\n✅ Rental data seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`  - ${pricings.length} rental pricings`)
    console.log(`  - ${contracts.length} rental contracts`)
    console.log(`  - ${contractItems.length} contract items`)
    console.log(`  - ${quoteRequests.length} quote requests`)
    console.log("\n🎉 You can now view the data in the admin UI!")
    console.log("   → http://localhost:9000/app/rentals")
    console.log("   → http://localhost:9000/app/rental-pricing")
    console.log("   → http://localhost:9000/app/quote-requests")

  } catch (error) {
    console.error("❌ Error seeding rental data:", error)
    throw error
  }
}
