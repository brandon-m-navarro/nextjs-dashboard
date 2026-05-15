import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import prisma  from '@/lib/prisma';

export async function fetchRevenue() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const revenue = await prisma.revenue.findMany();

    console.log('Data fetch completed after 3 seconds.');
    return revenue;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const invoices = await prisma.invoices.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
      include: {
        customer: true,
      },
    });

    const latestInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      image_url: invoice.customer.image_url,
      email: invoice.customer.email,
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      prisma.invoices.count(),
      prisma.customers.count(),
      prisma.invoices.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Get paid and pending amounts
    const [paidInvoices, pendingInvoices] = await Promise.all([
      prisma.invoices.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.invoices.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true },
      }),
    ]);

    const numberOfInvoices = invoiceCount;
    const numberOfCustomers = customerCount;
    const totalPaidInvoices = formatCurrency(paidInvoices._sum.amount ?? 0);
    const totalPendingInvoices = formatCurrency(pendingInvoices._sum.amount ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.invoices.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      orderBy: {
        date: 'desc',
      },
      include: {
        customer: true,
      },
      where: {
        OR: [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { amount: { equals: parseFloat(query) || undefined } },
          { date: { equals: new Date(query) || undefined } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      date: invoice.date,
      status: invoice.status,
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoices.count({
      where: {
        OR: [
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { amount: { equals: parseFloat(query) || undefined } },
          // { date: { equals: query || undefined } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return {
      ...invoice,
      amount: invoice.amount / 100, // Convert from cents to dollars
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchTableCustomers() {
  try {
    const customers = await prisma.customers.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        invoices: true,
      },
    });

    const customersWithTotals = customers.map((customer) => {
      const total_pending = customer.invoices
        .filter((inv) => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const total_paid = customer.invoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices: customer.invoices.length,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });

    return customersWithTotals;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const customers = await prisma.customers.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        invoices: true,
      },
    });

    const filteredCustomers = customers.map((customer) => {
      const total_pending = customer.invoices
        .filter((inv) => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const total_paid = customer.invoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices: customer.invoices.length,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });

    return filteredCustomers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}