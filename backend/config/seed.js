const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedDatabase = async (clearExisting = true) => {
  try {
    if (clearExisting) {
      console.log('[Seed] Clearing existing collections...');
      await Category.deleteMany({});
      await Product.deleteMany({});
    }

    // 1. Create Admin & Sample Customer if missing
    console.log('[Seed] Ensuring admin and sample customer exist...');
    let admin = await User.findOne({ email: 'admin@bakery.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Bakery Admin',
        email: 'admin@bakery.com',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin',
        address: {
          street: '101 Baker Street, Main Market',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      });
      console.log(`[Seed] Created Admin: ${admin.email}`);
    }

    let customer = await User.findOne({ email: 'rahul@bakery.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul@bakery.com',
        phone: '9812345678',
        password: 'customer123',
        role: 'customer',
        address: {
          street: 'Flat 402, Sunshine Apartments, MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001'
        }
      });
      console.log(`[Seed] Created Customer: ${customer.email}`);
    }

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
      let existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        existing = await Category.create(cat);
      }
      categoryMap[cat.name] = existing._id;
    }
    console.log(`[Seed] Categories verified: ${Object.keys(categoryMap).length}`);

    // 3. Create Expanded Catalog of 24 Bakery Products
    console.log('[Seed] Creating expanded bakery catalog...');
    const productsData = [
      // CAKES
      {
        name: 'Chocolate Truffle Cake',
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
        name: 'Strawberry Cream Cake',
        category: categoryMap['Cakes'],
        price: 650,
        description: 'Light vanilla sponge infused with fresh Mahabaleshwar strawberry puree, mascarpone frosting, and glazed fresh berries.',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Red Velvet Royale Cake',
        category: categoryMap['Cakes'],
        price: 720,
        description: 'Signature crimson cocoa sponge layered with silky Canadian cream cheese frosting and fine red velvet crumbs.',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Mango Passion Cheesecake',
        category: categoryMap['Cakes'],
        price: 680,
        description: 'Velvety baked New York cheesecake topped with a fragrant Alphonso mango puree and passion fruit reduction.',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Pineapple Glaze Cake',
        category: categoryMap['Cakes'],
        price: 480,
        description: 'Tropical fresh pineapple slices layered with fluffy dairy cream sponge and topped with maraschino cherries.',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },

      // PASTRIES
      {
        name: 'Madagascar Vanilla Pastry',
        category: categoryMap['Pastries'],
        price: 85,
        description: 'Delicate vanilla sponge square filled with silky Madagascar vanilla custard and topped with white chocolate glaze.',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Dutch Truffle Pastry',
        category: categoryMap['Pastries'],
        price: 95,
        description: 'Decadent individual pastry slice drenched in warm melted Belgian dark chocolate and cocoa dust.',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Blueberry Crown Pastry',
        category: categoryMap['Pastries'],
        price: 110,
        description: 'Flaky golden puff pastry cup filled with mascarpone vanilla cream and wild blueberry compote.',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Butterscotch Crunch Pastry',
        category: categoryMap['Pastries'],
        price: 90,
        description: 'Caramelized praline crunch folded between layers of butterscotch sponge and whipped cream.',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },

      // BREAD
      {
        name: 'Artisan Sourdough Loaf',
        category: categoryMap['Bread'],
        price: 65,
        description: 'Warm, golden artisanal sourdough loaf with a crispy crust and soft, airy crumb. Naturally fermented 36 hours.',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Whole Wheat Multigrain Bread',
        category: categoryMap['Bread'],
        price: 55,
        description: '100% stoneground whole wheat loaf studded with flaxseeds, rolled oats, sunflower seeds, and chia seeds.',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Garlic Herb Baguette',
        category: categoryMap['Bread'],
        price: 80,
        description: 'Crispy French baguette infused with slow-roasted garlic puree, fresh rosemary, parsley, and olive oil.',
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'French Brioche Loaf',
        category: categoryMap['Bread'],
        price: 95,
        description: 'Golden, buttery French breakfast brioche loaf with an ultra-tender, pillowy texture.',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },

      // COOKIES
      {
        name: 'Choco Chip Chunky Cookies',
        category: categoryMap['Cookies'],
        price: 180,
        description: 'Pack of 6 golden brown, buttery cookies loaded with gooey semi-sweet chocolate chunks and sea salt.',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
        unit: 'box',
        isFeatured: true
      },
      {
        name: 'Golden Butter Cashew Cookies',
        category: categoryMap['Cookies'],
        price: 160,
        description: 'Traditional melt-in-mouth nankhatai-style shortbread cookies enriched with roasted cashew bits and cardamom.',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
        unit: 'box',
        isFeatured: false
      },
      {
        name: 'Cranberry Almond Biscotti',
        category: categoryMap['Cookies'],
        price: 220,
        description: 'Double-baked Italian crunchy cookies loaded with whole roasted almonds and tangy dried cranberries.',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
        unit: 'box',
        isFeatured: false
      },

      // DONUTS
      {
        name: 'Classic Chocolate Glazed Donut',
        category: categoryMap['Donuts'],
        price: 75,
        description: 'Fluffy fried yeast ring donut dipped in dark chocolate ganache glaze and garnished with rainbow sprinkles.',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Boston Cream Filled Donut',
        category: categoryMap['Donuts'],
        price: 85,
        description: 'Soft pillow donut filled with rich Bavarian vanilla custard and dipped in glossy dark cocoa glaze.',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Strawberry Sprinkle Ring Donut',
        category: categoryMap['Donuts'],
        price: 70,
        description: 'Sweet pink strawberry glazed ring donut decorated with colorful crunchy sugar vermicelli.',
        stock: 28,
        imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },

      // CUPCAKES
      {
        name: 'Red Velvet Cupcake',
        category: categoryMap['Cupcakes'],
        price: 90,
        description: 'Signature crimson sponge cupcake piped high with tangy sweet cream cheese buttercream and red velvet crumbs.',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Blueberry Buttercream Cupcake',
        category: categoryMap['Cupcakes'],
        price: 85,
        description: 'Moist vanilla sponge filled with blueberry jam and topped with a purple berry buttercream swirl.',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      },
      {
        name: 'Choco Lava Molten Muffin',
        category: categoryMap['Cupcakes'],
        price: 75,
        description: 'Warm double chocolate chip muffin with a gooey molten melted chocolate core.',
        stock: 4, // low stock test
        imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },

      // BROWNIES
      {
        name: 'Dark Belgian Walnut Brownie',
        category: categoryMap['Brownies'],
        price: 110,
        description: 'Gooey, dense chocolate fudge square made with 70% dark cocoa and roasted Californian walnuts.',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Nutella Fudge Overload Brownie',
        category: categoryMap['Brownies'],
        price: 135,
        description: 'Ultra-fudgy brownie smothered with thick roasted hazelnut Nutella spread and chocolate crunchies.',
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: true
      },
      {
        name: 'Sea Salt Caramel Brownie',
        category: categoryMap['Brownies'],
        price: 120,
        description: 'Rich dark chocolate brownie swirled with golden salted caramel and topped with flaky Maldon sea salt.',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80',
        unit: 'piece',
        isFeatured: false
      }
    ];

    const createdProducts = [];
    for (const prod of productsData) {
      const p = await Product.create(prod);
      createdProducts.push(p);
    }
    console.log(`[Seed] Expanded Catalog created: ${createdProducts.length} bakery products.`);

    // 4. Create Sample Orders
    const ordersCount = await Order.countDocuments();
    if (ordersCount === 0 && customer && createdProducts.length > 0) {
      console.log('[Seed] Creating demo orders...');
      await Order.create({
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
            product: createdProducts[17]._id,
            name: createdProducts[17].name,
            price: createdProducts[17].price,
            quantity: 2,
            imageUrl: createdProducts[17].imageUrl
          }
        ],
        totalAmount: 550 + 75 * 2,
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
      console.log('[Seed] Demo order created.');
    }

    console.log('==============================================');
    console.log(`Seed completed successfully! Total Products: ${createdProducts.length}`);
    console.log('Admin Account: admin@bakery.com / admin123');
    console.log('Customer Account: rahul@bakery.com / customer123');
    console.log('==============================================');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};

// If run directly from terminal:
if (require.main === module) {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bakery_management_db';
  console.log(`[Seed] Connecting to MongoDB at ${mongoURI}...`);
  mongoose.connect(mongoURI).then(async () => {
    console.log('[Seed] Connected.');
    await seedDatabase(true);
    await mongoose.disconnect();
    process.exit(0);
  }).catch((err) => {
    console.error('[Seed] Connection failed:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
