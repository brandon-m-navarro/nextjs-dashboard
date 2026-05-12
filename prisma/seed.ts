import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const revenueData: Prisma.revenueCreateInput[] = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3500 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 2500 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
];

const customerData: Prisma.customersCreateInput[] = [
  {
    id: "13d07535-c59e-4157-a011-f8d2ef4e0cbb",
    name: "Shirt Buttons",
    email: "kirk@cousins.nfl",
    image_url: "/customers/kirk.png",
    invoices: {
      create: [
        {
          id: "9cc7915b-dc09-422c-ad51-e0829da20606",
          amount: 1500,
          status: "paid",
          date: new Date("2025-12-12"),
        },
        {
          id: "8fb19617-92c2-4f31-968b-190f1761c520",
          amount: 8546,
          status: "paid",
          date: new Date("2023-06-07"),
        },
        {
          id: "59690a81-e22e-48ea-aa15-3bcc3a86faff",
          amount: 34577,
          status: "pending",
          date: new Date("2023-08-05"),
        },
        {
          id: "49fc771c-a726-47fb-a3b6-4633913be5b6",
          amount: 8945,
          status: "paid",
          date: new Date("2023-06-03"),
        },
      ],
    },
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Brandon Navarro",
    email: "brandon.m.navarro@gmail.com",
    image_url: "/customers/myface.png",
    invoices: {
      create: [
        {
          id: "5959c786-8b9a-497d-bcc5-f66ed5c06ade",
          amount: 20348,
          status: "pending",
          date: new Date("2022-11-14"),
        },
        {
          id: "62ba3371-6b6e-46da-8e5f-732eb3709bc0",
          amount: 100856,
          status: "pending",
          date: new Date("2024-09-27"),
        },
        {
          id: "cc361808-fcd4-4c32-b6cf-e8c1108e7847",
          amount: 500,
          status: "paid",
          date: new Date("2023-08-19"),
        },
      ],
    },
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Frankie De Leo",
    email: "frankie@gmail.com",
    image_url: "/customers/lee-robinson.png",
    invoices: {
      create: [
        {
          id: "00fd222f-f467-4ece-9a24-311b8bb9c29e",
          amount: 1000,
          status: "paid",
          date: new Date("2022-06-05"),
        },
        {
          id: "6d8d5d63-5379-4072-affe-97e9b97b3cbc",
          amount: 54246,
          status: "pending",
          date: new Date("2023-07-16"),
        },
      ],
    },
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Michael Sullivan",
    email: "mike.sullivan@nbc.com",
    image_url: "/customers/michael-novotny.png",
    invoices: {
      create: [
        {
          id: "2d5ccc4f-9d1c-4b9a-b6ee-12b0bd3e54c2",
          amount: 50000,
          status: "paid",
          date: new Date("2023-09-10"),
        },
        {
          id: "98828c5e-577a-4a0f-8836-6db01e169756",
          amount: 32545,
          status: "paid",
          date: new Date("2023-06-09"),
        },
      ],
    },
  },
  {
    id: "cc27c14a-0acf-4f4a-a6c9-d45682c144b9",
    name: "Robin Downing",
    email: "redowning@msn.com",
    image_url: "/customers/robin.png",
    invoices: {
      create: [
        {
          id: "c54a621c-e376-4a16-a6cc-37e582923829",
          amount: 3040,
          status: "paid",
          date: new Date("2022-10-29"),
        },
        {
          id: "f48569c7-2cb6-43dd-ac97-fda6efe3d5e5",
          amount: 1250,
          status: "paid",
          date: new Date("2023-06-17"),
        },
      ],
    },
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
    image_url: "/customers/evil-rabbit.png",
    invoices: {
      create: [
        {
          id: "96d7f7da-16ea-4008-9698-5849e6fdc885",
          amount: 15795,
          status: "pending",
          date: new Date("2022-12-06"),
        },
        {
          id: "eedd21f2-d440-4c0a-aca2-fbda10cbe55d",
          amount: 666,
          status: "pending",
          date: new Date("2023-06-27"),
        },
      ],
    },
  },
];

export async function main() {
  for (const c of customerData) {
    await prisma.customers.create({ data: c });
  }
  for (const r of revenueData) {
    await prisma.revenue.create({ data: r });
  }
}

main();
