const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bakery_management_db';
    console.log(`[Seed] Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 1. Create Admin & Sample Customer
    console.log('[Seed] Creating admin and sample customer...');
    const admin = await User.create({
      name: 'Bakery Admin',
      email: 'admin@bakery.com',
      phone: '9876543210',
      password: 'admin123', // Will be hashed by User pre-save hook
      role: 'admin',
      address: {
        street: '101 Baker Street, Main Market',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    });

    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@bakery.com',
      phone: '9812345678',
      password: 'customer123', // Will be hashed by User pre-save hook
      role: 'customer',
      address: {
        street: 'Flat 402, Sunshine Apartments, MG Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      }
    });

    console.log(`[Seed] Created Admin: ${admin.email}`);
    console.log(`[Seed] Created Customer: ${customer.email}`);

    // 2. Create Categories
    console.log('[Seed] Creating categories...');
    const categoriesData = [
      {
        name: 'Cakes',
        description: 'Artisanal baked celebration and cream cakes made fresh daily with organic ingredients.',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Pastries',
        description: 'Flaky French-style layered pastries, eclairs, and fruit tarts.',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Bread',
        description: 'Freshly baked sourdough, rustic loaves, baguettes, and artisan sandwich bread.',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Cookies',
        description: 'Crispy and chewy cookies filled with chocolate chunks, oats, and nuts.',
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Donuts',
        description: 'Glazed, frosted, and filled ring donuts prepared fresh every morning.',
        imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Cupcakes',
        description: 'Individual fluffy sponge cupcakes topped with rich buttercream swirl.',
        imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Brownies',
        description: 'Decadent fudge brownies made with dark Belgian chocolate and walnuts.',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80'
      }
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const created = await Category.create(cat);
      categoryMap[cat.name] = created._id;
    }
    console.log(`[Seed] Created ${categoriesData.length} categories.`);

    // 3. Create Sample Bakery Products
    console.log('[Seed] Creating products...');
    const productsData = [
      {
        name: 'Chocolate Cake',
        category: categoryMap['Cakes'],
        price: 550,
        description: 'Rich, moist double-layer Dutch chocolate sponge coated with creamy dark chocolate ganache and chocolate curls.',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Black Forest Cake',
        category: categoryMap['Cakes'],
        price: 600,
        description: 'Traditional German sponge cake layered with whipped cream, sour cherries, and crowned with dark chocolate shavings.',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Strawberry Cake',
        category: categoryMap['Cakes'],
        price: 650,
        description: 'Light vanilla sponge infused with fresh Mahabaleshwar strawberry puree, mascarpone frosting, and glazed fresh berries.',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Vanilla Pastry',
        category: categoryMap['Pastries'],
        price: 85,
        description: 'Delicate vanilla sponge square filled with silky Madagascar vanilla custard and topped with white chocolate glaze.',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Chocolate Donut',
        category: categoryMap['Donuts'],
        price: 75,
        description: 'Fluffy fried ring donut dipped in dark chocolate glaze and garnished with rainbow sprinkles.',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Fresh Bread Loaf',
        category: categoryMap['Bread'],
        price: 55,
        description: 'Warm, golden artisanal sourdough loaf with a crispy crust and soft, airy crumb. Baked fresh every sunrise.',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Chocolate Chip Cookies',
        category: categoryMap['Cookies'],
        price: 180,
        description: 'Pack of 6 golden brown, buttery cookies loaded with gooey semi-sweet chocolate chunks and a pinch of sea salt.',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
        unit: 'box',
        isFeatured: true
      },
      {
        name: 'Velvet Cupcakes',
        category: categoryMap['Cupcakes'],
        price: 90,
        description: 'Signature red velvet cupcake paired with rich tangy cream cheese frosting and fine crumb decoration.',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Fudge Brownies',
        category: categoryMap['Brownies'],
        price: 110,
        description: 'Gooey, dense chocolate fudge square made with 70% dark cocoa and roasted Californian walnuts.',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Chocolate Muffins',
        category: categoryMap['Cupcakes'],
        price: 70,
        description: 'Oven-fresh jumbo chocolate chip muffin with a tender, moist crumb and crunchy caramelized muffin top.',
        stock: 4, // low stock test!
        imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      }
    ];

    const createdProducts = [];
    for (const prod of productsData) {
      const p = await Product.create(prod);
      createdProducts.push(p);
    }
    console.log(`[Seed] Created ${createdProducts.length} bakery products.`);

    // 4. Create Sample Orders for Demonstration
    console.log('[Seed] Creating demo orders...');
    const demoOrder = await Order.create({
      customer: customer._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          imageUrl: createdProducts[0].imageUrl
        },
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          price: createdProducts[4].price,
          quantity: 2,
          imageUrl: createdProducts[4].imageUrl
        }
      ],
      totalAmount: 550 + 75 * 2, // 700
      shippingAddress: {
        fullName: customer.name,
        phone: customer.phone,
        address: customer.address.street,
        city: customer.address.city,
        pincode: customer.address.pincode
      },
      paymentMethod: 'Cash on Delivery',
      orderStatus: 'Confirmed',
      orderNotes: 'Please deliver after 5 PM.'
    });

    console.log(`[Seed] Created demo order: #${demoOrder._id}`);
    console.log('==============================================');
    console.log('Seed completed successfully!');
    console.log('Admin Account: admin@bakery.com / admin123');
    console.log('Customer Account: rahul@bakery.com / customer123');
    console.log('==============================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
