import {
  db,
  users,
  platforms,
  units,
  categories,
  shippingProviders,
  paymentMethods,
  vouchers,
  shippingZones,
  storeSettings,
  siteSettings,
  products
} from './db/schema'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    console.log('🌱 Mulai seeding database...')

    // Hash password default untuk admin
    const defaultPassword = await bcrypt.hash('admin123', 12)

    // 1. Insert default platforms
    console.log('📋 Menambahkan platforms...')
    await db.insert(platforms).values([
      {
        name: 'website',
        displayName: 'Website',
        logo: 'https://example.com/logo.png',
        color: '#f6339a',
        status: 'active'
      },
      {
        name: 'tokopedia',
        displayName: 'Tokopedia',
        logo: 'https://example.com/logo.png',
        color: '#05ac10',
        status: 'active'
      },
      {
        name: 'shopee',
        displayName: 'Shopee',
        logo: 'https://example.com/logo.png',
        color: '#f7482e',
        status: 'active'
      },
      {
        name: 'tiktok_shop',
        displayName: 'Tiktok Shop',
        logo: 'https://example.com/logo.png',
        color: '#FF0000',
        status: 'active'
      },
      {
        name: 'whatsapp',
        displayName: 'WhatsApp',
        logo: 'https://example.com/logo.png',
        color: '#008069',
        status: 'active'
      }
    ]).onConflictDoNothing()

    // 2. Insert admin users
    console.log('👤 Menambahkan akun admin...')
    await db.insert(users).values([
      {
        name: 'Super Admin',
        email: process.env.EMAIL_SUPER_ADMIN,
        password: defaultPassword,
        role: 'super_admin',
        status: 'active',
        emailVerified: new Date()
      },
      {
        name: 'Admin',
        email: process.env.EMAIL_ADMIN,
        password: defaultPassword,
        role: 'admin',
        status: 'active',
        emailVerified: new Date()
      }
    ]).onConflictDoNothing()

    // 3. Insert default units
    console.log('📏 Menambahkan satuan produk...')
    await db.insert(units).values([
      { name: 'piece', symbol: 'pcs', description: 'Per piece/unit' },
      { name: 'kilogram', symbol: 'kg', description: 'Kilogram' },
      { name: 'gram', symbol: 'g', description: 'Gram' },
      { name: 'liter', symbol: 'L', description: 'Liter' },
      { name: 'meter', symbol: 'm', description: 'Meter' },
      { name: 'centimeter', symbol: 'cm', description: 'Centimeter' },
      { name: 'box', symbol: 'box', description: 'Per box/kotak' },
      { name: 'pack', symbol: 'pack', description: 'Per pack/kemasan' },
      { name: 'bottle', symbol: 'btl', description: 'Per bottle/botol' },
      { name: 'dozen', symbol: 'dzn', description: 'Per dozen/lusin' }
    ]).onConflictDoNothing()

    // 4. Insert default categories
    console.log(' Menambahkan kategori produk...')
    const categoryInserts = await db.insert(categories).values([
      { name: 'Elektronik', slug: 'elektronik', description: 'Produk elektronik dan gadget' },
      { name: 'Fashion', slug: 'fashion', description: 'Pakaian dan aksesoris' },
      { name: 'Makanan & Minuman', slug: 'makanan-minuman', description: 'Produk makanan dan minuman' },
      { name: 'Kesehatan & Kecantikan', slug: 'kesehatan-kecantikan', description: 'Produk kesehatan dan kecantikan' },
      { name: 'Rumah & Taman', slug: 'rumah-taman', description: 'Peralatan rumah tangga dan taman' },
      { name: 'Olahraga & Outdoor', slug: 'olahraga-outdoor', description: 'Peralatan olahraga dan outdoor' },
      { name: 'Buku & Hobi', slug: 'buku-hobi', description: 'Buku, majalah, dan peralatan hobi' },
      { name: 'Otomotif', slug: 'otomotif', description: 'Produk dan aksesoris otomotif' }
    ]).returning({ id: categories.id, name: categories.name })

    // 5. Insert shipping providers
    console.log('🚚 Menambahkan shipping providers...')
    await db.insert(shippingProviders).values([
      {
        name: 'JNE',
        code: 'jne',
        description: 'Jalur Nugraha Ekakurir',
        trackingUrlTemplate: 'https://www.jne.co.id/id/tracking/trace/{trackingNumber}',
        estimatedDeliveryDays: 3,
        isActive: true
      },
      {
        name: 'J&T Express',
        code: 'jnt',
        description: 'J&T Express Indonesia',
        trackingUrlTemplate: 'https://www.jet.co.id/track/{trackingNumber}',
        estimatedDeliveryDays: 2,
        isActive: true
      },
      {
        name: 'SiCepat',
        code: 'sicepat',
        description: 'SiCepat Ekspres',
        trackingUrlTemplate: 'https://www.sicepat.com/checkawb/{trackingNumber}',
        estimatedDeliveryDays: 2,
        isActive: true
      },
      {
        name: 'Pos Indonesia',
        code: 'pos',
        description: 'Pos Indonesia',
        trackingUrlTemplate: 'https://www.posindonesia.co.id/id/tracking/{trackingNumber}',
        estimatedDeliveryDays: 5,
        isActive: true
      },
      {
        name: 'TIKI',
        code: 'tiki',
        description: 'Titipan Kilat',
        trackingUrlTemplate: 'https://www.tiki.id/id/tracking?connote={trackingNumber}',
        estimatedDeliveryDays: 3,
        isActive: true
      }
    ]).onConflictDoNothing()

    // 6. Insert payment methods
    console.log('💳 Menambahkan payment methods...')
    await db.insert(paymentMethods).values([
      // Bank transfer manual (bisa lebih dari 1, BCA default)
      {
        name: 'Transfer Bank BCA',
        type: 'bank_transfer',
        code: 'bca_transfer',
        description: 'Transfer ke rekening BCA',
        instruction: 'Transfer ke rekening BCA: 1234567890 a.n. Pitaya Store',
        fees: '0',
        feeType: 'fixed',
        processingTime: '1-3 jam setelah transfer',
        isActive: true
      },
      {
        name: 'Transfer Bank Mandiri',
        type: 'bank_transfer',
        code: 'mandiri_transfer',
        description: 'Transfer ke rekening Mandiri',
        instruction: 'Transfer ke rekening Mandiri: 9876543210 a.n. Pitaya Store',
        fees: '0',
        feeType: 'fixed',
        processingTime: '1-3 jam setelah transfer',
        isActive: true
      },
      {
        name: 'Transfer Bank BRI',
        type: 'bank_transfer',
        code: 'bri_transfer',
        description: 'Transfer ke rekening BRI',
        instruction: 'Transfer ke rekening BRI: 1122334455 a.n. Pitaya Store',
        fees: '0',
        feeType: 'fixed',
        processingTime: '1-3 jam setelah transfer',
        isActive: true,
      },
      // E-wallet & lain-lain
      {
        name: 'GoPay',
        type: 'e_wallet',
        code: 'gopay',
        description: 'Pembayaran melalui GoPay',
        fees: '2500',
        feeType: 'fixed',
        minAmount: '10000',
        maxAmount: '10000000',
        processingTime: 'Instant',
        isActive: true,
      },
      {
        name: 'OVO',
        type: 'e_wallet',
        code: 'ovo',
        description: 'Pembayaran melalui OVO',
        fees: '2500',
        feeType: 'fixed',
        minAmount: '10000',
        maxAmount: '10000000',
        processingTime: 'Instant',
        isActive: true,
      },
      {
        name: 'DANA',
        type: 'e_wallet',
        code: 'dana',
        description: 'Pembayaran melalui DANA',
        fees: '2500',
        feeType: 'fixed',
        minAmount: '10000',
        maxAmount: '10000000',
        processingTime: 'Instant',
        isActive: true,
      },
      {
        name: 'COD (Cash on Delivery)',
        type: 'cash_on_delivery',
        code: 'cod',
        description: 'Bayar tunai saat terima barang',
        fees: '5000',
        feeType: 'fixed',
        minAmount: '50000',
        maxAmount: '2000000',
        processingTime: 'Bayar saat terima barang',
        isActive: true,
      },
      {
        name: 'COD Internal Courier',
        type: 'cod_internal_courier',
        code: 'cod_internal',
        description: 'Bayar tunai ke kurir internal Pitaya Store (hanya area tertentu)',
        fees: '3000',
        feeType: 'fixed',
        minAmount: '50000',
        maxAmount: '1000000',
        processingTime: 'Bayar ke kurir internal',
        isActive: true,
      }
    ]).onConflictDoNothing()

    // 7. Insert vouchers (promosi)
    console.log('🎟️  Menambahkan vouchers...')
    await db.insert(vouchers).values([
      {
        code: 'BELANJAHEMAT10',
        type: 'discount',
        title: 'Diskon 10% Belanja',
        description: 'Diskon 10% untuk semua produk, minimum belanja Rp 100.000',
        percent: 10,
        minOrder: '100000',
        maxDiscount: '30000',
        quota: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari ke depan
        isActive: true
      },
      {
        code: 'ONGKIRGRATIS',
        type: 'shipping',
        title: 'Diskon Ongkir Rp 15.000',
        description: 'Potongan ongkir hingga Rp 15.000 untuk area tertentu',
        value: '15000',
        minOrder: '50000',
        quota: 200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 hari ke depan
        isActive: true
      }
    ]).onConflictDoNothing()

    // 8. Insert shipping zones
    console.log('🗺️  Menambahkan shipping zones...')
    await db.insert(shippingZones).values([
      {
        name: 'Jakarta Selatan',
        description: 'Khusus area Jakarta Selatan',
        area: ['Kebayoran Baru', 'Tebet', 'Mampang', 'Pasar Minggu', 'Jagakarsa'],
        shippingDiscount: '10000',
        isActive: true
      },
      {
        name: 'Bandung Kota',
        description: 'Khusus area Kota Bandung',
        area: ['Cicendo', 'Coblong', 'Sukajadi', 'Lengkong', 'Sumur Bandung'],
        shippingDiscount: '7000',
        isActive: true
      }
    ]).onConflictDoNothing()

    // 9. Insert store settings
    console.log('🏪 Menambahkan store settings...')
    await db.insert(storeSettings).values([
      {
        key: 'store_name',
        value: 'Pitaya Store',
        label: 'Nama Toko',
        description: 'Nama resmi toko',
        type: 'text',
        category: 'general',
        sortOrder: 1
      },
      {
        key: 'store_description',
        value: 'Toko online terlengkap dengan kualitas terbaik',
        label: 'Deskripsi Toko',
        description: 'Deskripsi singkat tentang toko',
        type: 'text',
        category: 'general',
        sortOrder: 2
      },
      {
        key: 'store_address',
        value: 'Jl. Contoh No. 123, Jakarta Selatan',
        label: 'Alamat Toko',
        description: 'Alamat lengkap toko',
        type: 'text',
        category: 'contact',
        sortOrder: 3
      },
      {
        key: 'store_phone',
        value: '+6282277563627',
        label: 'Nomor Telepon',
        description: 'Nomor telepon untuk customer service',
        type: 'text',
        category: 'contact',
        sortOrder: 4
      },
      {
        key: 'store_email',
        value: 'info@pitayastore.com',
        label: 'Email Toko',
        description: 'Email resmi toko',
        type: 'text',
        category: 'contact',
        sortOrder: 5
      },
      {
        key: 'whatsapp_number',
        value: '+6282277563627',
        label: 'Nomor WhatsApp',
        description: 'Nomor WhatsApp untuk customer service',
        type: 'text',
        category: 'contact',
        sortOrder: 6
      },
      {
        key: 'min_order_amount',
        value: '25000',
        label: 'Minimum Order',
        description: 'Minimum nilai pembelian',
        type: 'number',
        category: 'general',
        sortOrder: 7
      },
      {
        key: 'free_shipping_min',
        value: '100000',
        label: 'Gratis Ongkir Minimal',
        description: 'Minimum pembelian untuk gratis ongkir',
        type: 'number',
        category: 'shipping',
        sortOrder: 8
      }
    ]).onConflictDoNothing()

    // 8. Insert site settings
    console.log('🎨 Menambahkan site settings...')
    await db.insert(siteSettings).values([
      {
        key: 'primary_color',
        value: '#e11d48',
        label: 'Warna Utama',
        description: 'Warna utama website',
        type: 'color',
        category: 'colors',
        sortOrder: 1
      },
      {
        key: 'secondary_color',
        value: '#64748b',
        label: 'Warna Sekunder',
        description: 'Warna sekunder website',
        type: 'color',
        category: 'colors',
        sortOrder: 2
      },
      {
        key: 'accent_color',
        value: '#059669',
        label: 'Warna Aksen',
        description: 'Warna aksen untuk highlight',
        type: 'color',
        category: 'colors',
        sortOrder: 3
      },
      {
        key: 'logo_url',
        value: '/images/logo.png',
        label: 'Logo Website',
        description: 'URL logo website',
        type: 'image',
        category: 'branding',
        sortOrder: 4
      },
      {
        key: 'favicon_url',
        value: '/favicon.ico',
        label: 'Favicon',
        description: 'URL favicon website',
        type: 'image',
        category: 'branding',
        sortOrder: 5
      },
      {
        key: 'site_title',
        value: 'Pitaya Store - Toko Online Terpercaya',
        label: 'Judul Website',
        description: 'Judul yang muncul di tab browser',
        type: 'text',
        category: 'branding',
        sortOrder: 6
      },
      {
        key: 'meta_description',
        value: 'Pitaya Store adalah toko online terpercaya dengan berbagai produk berkualitas dan pelayanan terbaik',
        label: 'Meta Description',
        description: 'Deskripsi website untuk SEO',
        type: 'text',
        category: 'branding',
        sortOrder: 7
      }
    ]).onConflictDoNothing()

    // 9. Insert sample products
    console.log('📦 Menambahkan produk contoh...')
    const elektronikCategory = categoryInserts.find(cat => cat.name === 'Elektronik')
    const fashionCategory = categoryInserts.find(cat => cat.name === 'Fashion')

    if (elektronikCategory && fashionCategory) {
      await db.insert(products).values([
        {
          sku: 'ELEC-001',
          name: 'Smartphone Android 12GB RAM',
          slug: 'smartphone-android-12gb-ram',
          description: 'Smartphone flagship dengan RAM 12GB, storage 256GB, kamera 108MP, dan baterai 5000mAh',
          shortDescription: 'Smartphone flagship dengan performa tinggi',
          categoryId: elektronikCategory.id,
          costPrice: '3500000',
          hpp: '4000000',
          sellingPrice: '5500000',
          weight: 200,
          stockQuantity: 25,
          minStockLevel: 5,
          images: ['/images/products/smartphone-1.jpg', '/images/products/smartphone-2.jpg'],
          thumbnailUrl: '/images/products/smartphone-thumb.jpg',
          status: 'active',
          featured: true,
          metaTitle: 'Smartphone Android 12GB RAM - Pitaya Store',
          metaDescription: 'Beli smartphone flagship dengan RAM 12GB terbaru di Pitaya Store'
        },
        {
          sku: 'ELEC-002',
          name: 'Wireless Earbuds TWS',
          slug: 'wireless-earbuds-tws',
          description: 'Earbuds wireless dengan teknologi TWS, noise cancellation, dan battery life hingga 24 jam',
          shortDescription: 'Earbuds wireless dengan kualitas suara premium',
          categoryId: elektronikCategory.id,
          costPrice: '150000',
          hpp: '200000',
          sellingPrice: '350000',
          weight: 50,
          stockQuantity: 50,
          minStockLevel: 10,
          images: ['/images/products/earbuds-1.jpg'],
          thumbnailUrl: '/images/products/earbuds-thumb.jpg',
          status: 'active',
          featured: false
        },
        {
          sku: 'FASH-001',
          name: 'Kaos Polos Premium Cotton',
          slug: 'kaos-polos-premium-cotton',
          description: 'Kaos polos berbahan 100% cotton premium, nyaman dipakai, tersedia berbagai warna dan ukuran',
          shortDescription: 'Kaos polos premium dengan bahan berkualitas',
          categoryId: fashionCategory.id,
          costPrice: '25000',
          hpp: '35000',
          sellingPrice: '65000',
          weight: 150,
          stockQuantity: 100,
          minStockLevel: 20,
          images: ['/images/products/kaos-1.jpg', '/images/products/kaos-2.jpg'],
          thumbnailUrl: '/images/products/kaos-thumb.jpg',
          status: 'active',
          featured: true
        }
      ]).onConflictDoNothing()
    }

    console.log('✅ Seeding berhasil!')
    console.log('📊 Data yang ditambahkan:')
    console.log('- 5 platforms')
    console.log('- 2 akun admin (password default: admin123)')
    console.log('- 10 satuan produk')
    console.log(`- ${categoryInserts.length} kategori produk`)
    console.log('- 5 shipping providers')
    console.log('- 7+ payment methods')
    console.log('- 8 store settings')
    console.log('- 2 vouchers (diskon belanja & ongkir)')
    console.log('- 2 shipping zones (Jaksel, Bandung)')
    console.log('- 7 site settings')
    console.log('- 3 produk contoh')
    console.log()
    console.log('🔐 Akun Admin:')
    console.log(`Super Admin: ${process.env.EMAIL_SUPER_ADMIN} / admin123`)
    console.log(`Admin: ${process.env.EMAIL_ADMIN} / admin123`)
    console.log()
    console.log('🏪 Store Settings:')
    console.log('- Nama Toko: Pitaya Store')
    console.log('- Minimum Order: Rp 25.000')
    console.log('- Gratis Ongkir: Rp 100.000')
    console.log('- WhatsApp: +6282277563627')

  } catch (error) {
    console.error('❌ Error saat seeding:', error)
    throw error
  }
}

// Jalankan seed jika file ini dieksekusi langsung
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding database selesai!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding gagal:', error)
      process.exit(1)
    })
}

export default seed
