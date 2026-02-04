import { MedusaContainer } from "@medusajs/framework/types"

/**
 * Seed script voor rental module test data
 * 
 * Dit script voegt test data toe aan de rental module:
 * - Rental Pricing voor verschillende producten
 * - Rental Contracts met verschillende statussen
 * - Quote Requests met verschillende statussen
 * 
 * Gebruik: node --loader ts-node/esm src/scripts/seed-rental-data.ts
 */

export default async function seedRentalData(container: MedusaContainer) {
  const rentalModuleService = container.resolve("rentalModuleService")

  console.log("🌱 Starting rental data seeding...")

  try {
    // 1. Seed Rental Pricing
    console.log("\n📊 Creating rental pricing...")
    
    const pricings = [
      {
        product_id: "prod_laptop_dell_xps_15",
        rental_type: "flex",
        monthly_price: 89.99,
        deposit_amount: 500.00,
        is_available: true,
      },
      {
        product_id: "prod_laptop_dell_xps_15",
        rental_type: "jaar",
        monthly_price: 69.99,
        deposit_amount: 500.00,
        is_available: true,
      },
      {
        product_id: "prod_laptop_macbook_pro_14",
        rental_type: "flex",
        monthly_price: 129.99,
        deposit_amount: 800.00,
        is_available: true,
      },
      {
        product_id: "prod_laptop_macbook_pro_14",
        rental_type: "jaar",
        monthly_price: 99.99,
        deposit_amount: 800.00,
        is_available: true,
      },
      {
        product_id: "prod_monitor_dell_27",
        rental_type: "flex",
        monthly_price: 29.99,
        deposit_amount: 150.00,
        is_available: true,
      },
      {
        product_id: "prod_monitor_dell_27",
        rental_type: "jaar",
        monthly_price: 24.99,
        deposit_amount: 150.00,
        is_available: true,
      },
      {
        product_id: "prod_docking_station",
        rental_type: "flex",
        monthly_price: 19.99,
        deposit_amount: 100.00,
        is_available: true,
      },
    ]

    for (const pricing of pricings) {
      await rentalModuleService.createRentalPricing(pricing)
      console.log(`  ✅ Created pricing for ${pricing.product_id} (${pricing.rental_type})`)
    }

    // 2. Seed Rental Contracts
    console.log("\n📝 Creating rental contracts...")

    const contracts = [
      {
        customer_id: "cus_01JKHW8XQZM9P2N3R4T5V6W7X8",
        contract_number: "RC-2026-001",
        rental_type: "flex",
        status: "actief",
        start_date: new Date("2025-12-01"),
        end_date: new Date("2026-12-01"),
        earliest_end_date: new Date("2026-03-01"),
        monthly_amount: 89.99,
        deposit_amount: 500.00,
        deposit_status: "betaald",
        notes: "Eerste contract voor nieuwe klant. Levering op kantoor.",
      },
      {
        customer_id: "cus_02JKHW8XQZM9P2N3R4T5V6W7X9",
        contract_number: "RC-2026-002",
        rental_type: "jaar",
        status: "actief",
        start_date: new Date("2026-01-15"),
        end_date: new Date("2027-01-15"),
        earliest_end_date: new Date("2027-01-15"),
        monthly_amount: 99.99,
        deposit_amount: 800.00,
        deposit_status: "betaald",
        notes: "MacBook Pro voor designer. Inclusief docking station.",
      },
      {
        customer_id: "cus_03JKHW8XQZM9P2N3R4T5V6W7Y0",
        contract_number: "RC-2026-003",
        rental_type: "flex",
        status: "in_afwachting",
        start_date: new Date("2026-02-10"),
        end_date: new Date("2027-02-10"),
        earliest_end_date: new Date("2026-05-10"),
        monthly_amount: 29.99,
        deposit_amount: 150.00,
        deposit_status: "openstaand",
        notes: "Wacht op betaling borg voordat levering kan plaatsvinden.",
      },
      {
        customer_id: "cus_04JKHW8XQZM9P2N3R4T5V6W7Y1",
        contract_number: "RC-2025-089",
        rental_type: "jaar",
        status: "beëindigd",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2026-01-01"),
        earliest_end_date: new Date("2026-01-01"),
        monthly_amount: 69.99,
        deposit_amount: 500.00,
        deposit_status: "terugbetaald",
        notes: "Contract succesvol afgerond. Apparatuur in goede staat geretourneerd.",
      },
      {
        customer_id: "cus_05JKHW8XQZM9P2N3R4T5V6W7Y2",
        contract_number: "RC-2026-004",
        rental_type: "flex",
        status: "eindigt_binnenkort",
        start_date: new Date("2025-11-01"),
        end_date: new Date("2026-02-01"),
        earliest_end_date: new Date("2026-02-01"),
        monthly_amount: 89.99,
        deposit_amount: 500.00,
        deposit_status: "betaald",
        notes: "Opzegtermijn loopt. Klant wil niet verlengen.",
      },
    ]

    const createdContracts = []
    for (const contract of contracts) {
      const created = await rentalModuleService.createRentalContract(contract)
      createdContracts.push(created)
      console.log(`  ✅ Created contract ${contract.contract_number} (${contract.status})`)
    }

    // 3. Add Contract Items
    console.log("\n📦 Adding items to contracts...")

    const contractItems = [
      // RC-2026-001 items
      {
        contract_id: createdContracts[0].id,
        product_id: "prod_laptop_dell_xps_15",
        quantity: 1,
        serial_number: "DXP15-2024-A1234",
        condition_at_delivery: "nieuw",
        condition_at_return: null,
      },
      // RC-2026-002 items
      {
        contract_id: createdContracts[1].id,
        product_id: "prod_laptop_macbook_pro_14",
        quantity: 1,
        serial_number: "MBP14-2024-B5678",
        condition_at_delivery: "nieuw",
        condition_at_return: null,
      },
      {
        contract_id: createdContracts[1].id,
        product_id: "prod_docking_station",
        quantity: 1,
        serial_number: "DOCK-2024-C9012",
        condition_at_delivery: "nieuw",
        condition_at_return: null,
      },
      // RC-2026-003 items
      {
        contract_id: createdContracts[2].id,
        product_id: "prod_monitor_dell_27",
        quantity: 2,
        serial_number: "MON27-2024-D3456",
        condition_at_delivery: "nieuw",
        condition_at_return: null,
      },
      // RC-2025-089 items (beëindigd)
      {
        contract_id: createdContracts[3].id,
        product_id: "prod_laptop_dell_xps_15",
        quantity: 1,
        serial_number: "DXP15-2023-E7890",
        condition_at_delivery: "nieuw",
        condition_at_return: "goed",
      },
      // RC-2026-004 items
      {
        contract_id: createdContracts[4].id,
        product_id: "prod_laptop_dell_xps_15",
        quantity: 1,
        serial_number: "DXP15-2024-F1122",
        condition_at_delivery: "nieuw",
        condition_at_return: null,
      },
    ]

    for (const item of contractItems) {
      await rentalModuleService.createRentalContractItem(item)
      console.log(`  ✅ Added item ${item.product_id} to contract`)
    }

    // 4. Seed Quote Requests
    console.log("\n💬 Creating quote requests...")

    const quoteRequests = [
      {
        company_name: "Tech Startup BV",
        contact_person: "Jan Jansen",
        email: "jan@techstartup.nl",
        phone: "+31612345678",
        desired_start_date: new Date("2026-03-01"),
        desired_end_date: new Date("2026-03-15"),
        desired_items: JSON.stringify([
          { product_id: "prod_laptop_dell_xps_15", quantity: 5 },
          { product_id: "prod_monitor_dell_27", quantity: 5 },
        ]),
        status: "nieuw",
        notes: "Voor tijdelijk project. Levering op kantoor gewenst.",
      },
      {
        company_name: "Event Company Amsterdam",
        contact_person: "Sarah de Vries",
        email: "sarah@eventcompany.nl",
        phone: "+31687654321",
        desired_start_date: new Date("2026-04-10"),
        desired_end_date: new Date("2026-04-12"),
        desired_items: JSON.stringify([
          { product_id: "prod_laptop_macbook_pro_14", quantity: 10 },
          { product_id: "prod_docking_station", quantity: 10 },
        ]),
        status: "in_behandeling",
        notes: "Voor conferentie. Moet 1 dag voor event geleverd worden.",
      },
      {
        company_name: "Marketing Bureau Rotterdam",
        contact_person: "Peter Bakker",
        email: "peter@marketingbureau.nl",
        phone: "+31698765432",
        desired_start_date: new Date("2026-02-15"),
        desired_end_date: new Date("2026-03-15"),
        desired_items: JSON.stringify([
          { product_id: "prod_laptop_macbook_pro_14", quantity: 3 },
        ]),
        status: "offerte_verstuurd",
        notes: "Offerte verstuurd op 2026-02-01. Wacht op reactie.",
      },
      {
        company_name: "Consultancy Firm Utrecht",
        contact_person: "Lisa Vermeulen",
        email: "lisa@consultancy.nl",
        phone: "+31676543210",
        desired_start_date: new Date("2026-01-20"),
        desired_end_date: new Date("2026-02-20"),
        desired_items: JSON.stringify([
          { product_id: "prod_laptop_dell_xps_15", quantity: 2 },
          { product_id: "prod_monitor_dell_27", quantity: 2 },
          { product_id: "prod_docking_station", quantity: 2 },
        ]),
        status: "geaccepteerd",
        notes: "Klant heeft offerte geaccepteerd. Contract wordt opgesteld.",
      },
      {
        company_name: "Design Studio Den Haag",
        contact_person: "Mark de Jong",
        email: "mark@designstudio.nl",
        phone: "+31665432109",
        desired_start_date: new Date("2026-02-01"),
        desired_end_date: new Date("2026-02-07"),
        desired_items: JSON.stringify([
          { product_id: "prod_laptop_macbook_pro_14", quantity: 1 },
        ]),
        status: "afgewezen",
        notes: "Klant vond prijs te hoog. Geen reactie meer ontvangen.",
      },
    ]

    for (const request of quoteRequests) {
      await rentalModuleService.createQuoteRequest(request)
      console.log(`  ✅ Created quote request for ${request.company_name} (${request.status})`)
    }

    console.log("\n✅ Rental data seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`  - ${pricings.length} rental pricings`)
    console.log(`  - ${contracts.length} rental contracts`)
    console.log(`  - ${contractItems.length} contract items`)
    console.log(`  - ${quoteRequests.length} quote requests`)
    console.log("\n🎉 You can now view the data in the admin UI!")

  } catch (error) {
    console.error("❌ Error seeding rental data:", error)
    throw error
  }
}
