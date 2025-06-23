import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { products, categories, units } from "@/drizzle/db/schema";
import { eq, desc, asc, like, and, sql } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// GET: Mengambil daftar products dengan pagination dan filter
export async function GET(request: NextRequest) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const { searchParams } = new URL(request.url);
    
    // Parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        like(products.name, `%${search}%`)
      );
    }
    
    if (status) {
      whereConditions.push(eq(products.status, status as any));
    }
    
    if (categoryId) {
      whereConditions.push(eq(products.categoryId, parseInt(categoryId)));
    }

    // Query products dengan join ke categories dan units
    const productsQuery = db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        costPrice: products.costPrice,
        hpp: products.hpp,
        sellingPrice: products.sellingPrice,
        weight: products.weight,
        dimensions: products.dimensions,
        stockQuantity: products.stockQuantity,
        minStockLevel: products.minStockLevel,
        maxStockLevel: products.maxStockLevel,
        images: products.images,
        thumbnailUrl: products.thumbnailUrl,
        status: products.status,
        isTrackingStock: products.isTrackingStock,
        allowBackorder: products.allowBackorder,
        featured: products.featured,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        metaKeywords: products.metaKeywords,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug
        },
        unit: {
          id: units.id,
          name: units.name,
          symbol: units.symbol
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id));

    if (whereConditions.length > 0) {
      productsQuery.where(and(...whereConditions));
    }

    // Apply sorting
    if (sortOrder === 'asc') {
      productsQuery.orderBy(asc(products[sortBy as keyof typeof products] as any));
    } else {
      productsQuery.orderBy(desc(products[sortBy as keyof typeof products] as any));
    }

    // Apply pagination
    productsQuery.limit(limit).offset(offset);

    const result = await productsQuery;

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(products);

    if (whereConditions.length > 0) {
      totalCountQuery.where(and(...whereConditions));
    }

    const [{ count: totalCount }] = await totalCountQuery;

    const totalPages = Math.ceil(totalCount / limit);

    return createApiResponse({
      data: result,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST: Membuat product baru
export async function POST(request: NextRequest) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const body = await request.json();

    // Validasi required fields
    const requiredFields = ['sku', 'name', 'slug', 'costPrice', 'hpp', 'sellingPrice'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`Field ${field} is required`, 400);
      }
    }

    // Check if SKU already exists
    const existingSku = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.sku, body.sku))
      .limit(1);

    if (existingSku.length > 0) {
      return createErrorResponse('SKU already exists', 409);
    }

    // Check if slug already exists
    const existingSlug = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, body.slug))
      .limit(1);

    if (existingSlug.length > 0) {
      return createErrorResponse('Slug already exists', 409);
    }

    // Create new product
    const newProduct = await db.insert(products).values({
      sku: body.sku,
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      shortDescription: body.shortDescription || null,
      categoryId: body.categoryId || null,
      unitId: body.unitId || null,
      costPrice: body.costPrice,
      hpp: body.hpp,
      sellingPrice: body.sellingPrice,
      weight: body.weight || null,
      dimensions: body.dimensions || null,
      stockQuantity: body.stockQuantity || 0,
      minStockLevel: body.minStockLevel || 0,
      maxStockLevel: body.maxStockLevel || null,
      images: body.images || [],
      thumbnailUrl: body.thumbnailUrl || null,
      status: body.status || 'active',
      isTrackingStock: body.isTrackingStock !== undefined ? body.isTrackingStock : true,
      allowBackorder: body.allowBackorder !== undefined ? body.allowBackorder : false,
      featured: body.featured !== undefined ? body.featured : false,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      metaKeywords: body.metaKeywords || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return createApiResponse({
      message: 'Product created successfully',
      data: newProduct[0]
    }, 201);

  } catch (error) {
    console.error('Error creating product:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
