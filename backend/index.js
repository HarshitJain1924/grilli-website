const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const client = require("prom-client");

// Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Metrics Middleware
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
});

// Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || "mongodb://mongodb:27017/grilli";

const seedData = async () => {
  try {
    const count = await Reservation.countDocuments();
    if (count === 0) {
      await Reservation.insertMany([
        {
          name: "Aarav Sharma",
          phone: "9820012345",
          person: "2 Person",
          date: "2026-04-05",
          time: "07:00pm",
          message: "Window seat please.",
          createdAt: new Date("2026-04-05T19:00:00Z"),
        },
        {
          name: "Priya Patel",
          phone: "9830067890",
          person: "4 Person",
          date: "2026-04-06",
          time: "08:00pm",
          message: "Birthday celebration!",
          createdAt: new Date("2026-04-06T20:00:00Z"),
        },
        {
          name: "Rohan Malhotra",
          phone: "9840011223",
          person: "1 Person",
          date: "2026-04-06",
          time: "01:00pm",
          message: "Quick lunch.",
          createdAt: new Date("2026-04-06T13:00:00Z"),
        },
      ]);
      console.log("Database seeded with sample reservations!");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    seedData();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  person: String,
  date: String,
  time: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

// 100% Pure Veg Menu Data
const menuItems = [
  {
    id: 1,
    name: "Paneer Tikka Platter",
    price: "₹320.00",
    description: "Creamy paneer cubes marinated in rich Indian spices and grilled to perfection in a tandoor with bell peppers.",
    image: "./assets/images/paneer_tikka.png",
    badge: "Popular",
  },
  {
    id: 2,
    name: "Veg Seekh Kebab",
    price: "₹280.00",
    description: "Aromatic vegetable skewers seasoned with exotic spices and grilled for a smoky, melt-in-the-mouth texture.",
    image: "./assets/images/veg_kebab.png",
  },
  {
    id: 3,
    name: "Crispy Corn Bhel",
    price: "₹180.00",
    description: "A vibrant fusion of golden corn, fresh pomegranate, and spicy chutneys for a crunchy start.",
    image: "./assets/images/corn_bhel.png",
    badge: "New",
  },
  {
    id: 4,
    name: "Stuffed Mushroom Caps",
    price: "₹240.00",
    description: "Large mushroom caps filled with a decadent herb and cheese blend, baked until golden and bubbly.",
    image: "./assets/images/stuffed_mushrooms.png",
  },
  {
    id: 5,
    name: "Signature Dal Makhani",
    price: "₹350.00",
    description: "Our world-famous slow-cooked black lentils simmered overnight with cream and white butter.",
    image: "./assets/images/dal_makhani.png",
    badge: "Bestseller",
  },
  {
    id: 6,
    name: "Paneer Lababdar",
    price: "₹420.00",
    description: "Succulent cottage cheese cubes immersed in a rich, creamy tomato and onion gravy with secret spices.",
    image: "./assets/images/paneer_lababdar.png",
  },
  {
    id: 7,
    name: "Malai Kofta Elegant",
    price: "₹380.00",
    description: "Soft melt-in-mouth dumplings made of paneer and nuts, served in a luxurious cashew-based white gravy.",
    image: "./assets/images/malai_kofta.png",
  },
  {
    id: 8,
    name: "Veg Hyderabadi Biryani",
    price: "₹450.00",
    description: "A royal blend of saffron rice and garden-fresh vegetables slow-cooked in a traditional earthen pot.",
    image: "./assets/images/veg_biryani.png",
    badge: "Royal",
  },
  {
    id: 9,
    name: "Soya Chaap Tikka Masala",
    price: "₹320.00",
    description: "Traditional tandoori soya chaap cooked in a spicy, flavorful red gravy, garnished with ginger and cream.",
    image: "./assets/images/soya_chaap.png",
  },
  {
    id: 10,
    name: "Truffle Mac & Cheese (Veg)",
    price: "₹480.00",
    description: "A premium international fusion of creamy macaroni and mature cheddar, infused with aromatic truffle oil.",
    image: "./assets/images/truffle_mac.png",
  },
  {
    id: 11,
    name: "Avocado Bruschetta",
    price: "₹290.00",
    description: "Toasted artisan bread topped with fresh avocado mash, cherry tomatoes, and a balsamic glaze drizzle.",
    image: "./assets/images/bruschetta.png",
  },
  {
    id: 12,
    name: "Eggless Chocolate Lava Cake",
    price: "₹260.00",
    description: "A decadent chocolate delight with a molten center, served with a scoop of premium vanilla bean gelato.",
    image: "./assets/images/veg_lava_cake.png",
    badge: "Dessert",
  },
];

const testimonials = [
  {
    id: 1,
    text: "The best Pure Veg fine dining experience I've ever had. Truly gourmet!",
    name: "Ananya Desai",
    image: "./assets/images/testi-avatar.jpg",
  },
];

// Routes
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/menu", (req, res) => res.json(menuItems));
app.get("/api/testimonials", (req, res) => res.json(testimonials));

app.get("/api/admin/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

app.delete("/api/admin/reservations", async (req, res) => {
  try {
    await Reservation.deleteMany({});
    res.status(200).json({ message: "All reservations cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear reservations" });
  }
});

app.post("/api/reserve", async (req, res) => {
  try {
    const { name, phone, confirm_email } = req.body;

    // Honeypot check
    if (confirm_email) {
      return res.status(201).json({ message: "Reservation successful!" });
    }

    if (!name || name.trim().length < 2 || !phone || phone.trim().length < 8) {
      return res.status(400).json({ error: "Please provide a valid name and phone number." });
    }

    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ message: "Reservation successful!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save reservation" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
