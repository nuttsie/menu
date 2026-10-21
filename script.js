/* ==========================================
   1. DATA PRODUK MENU (ARRAY OF OBJECTS)
   ========================================== */
const menuItems = [
    {
        id: 1,
        name: "Kopi Susu Gula Aren",
        category: "kopi",
        price: 18000,
        description: "Espresso dengan fresh milk dan manisnya gula aren asli.",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Americano Ice",
        category: "kopi",
        price: 15000,
        description: "Kopi hitam murni dengan kesegaran es batu.",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Croissant Mentega",
        category: "snack",
        price: 22000,
        description: "Pastry renyah dengan aroma mentega yang kuat.",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "French Fries",
        category: "snack",
        price: 16000,
        description: "Kentang goreng garing dengan taburan bumbu gurih.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Matcha Latte",
        category: "dessert",
        price: 24000,
        description: "Minuman teh hijau Jepang dengan susu lembut.",
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Chocolate Lava Cake",
        category: "dessert",
        price: 28000,
        description: "Kue cokelat lembut dengan lelehan cokelat hangat di dalam.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80"
    }
];

// Array untuk menampung item yang dimasukkan ke keranjang belanja
let cart = [];


/* ==========================================
   2. ELEMEN HTML DOM SELEKTOR
   ========================================== */
const menuContainer = document.getElementById("menu-container");
const cartItemsContainer = document.getElementById("cart-items");
const totalCountEl = document.getElementById("total-count");
const totalPriceEl = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const filterBtns = document.querySelectorAll(".filter-btn");

// Elemen Modal Tiket Digital
const ticketModal = document.getElementById("ticket-modal");
const ticketIdEl = document.getElementById("ticket-id");
const ticketTableEl = document.getElementById("ticket-table");
const ticketItemsSummary = document.getElementById("ticket-items-summary");
const ticketTotalPriceEl = document.getElementById("ticket-total-price");
const newOrderBtn = document.getElementById("new-order-btn");
const tableNumberInput = document.getElementById("tableNumber");


/* ==========================================
   3. FUNGSI RENDER KATALOG MENU
   ========================================== */
function displayMenu(category = "all") {
    menuContainer.innerHTML = ""; // Bersihkan kontainer sebelum isi ulang

    // Filter produk berdasarkan kategori yang dipilih
    const filteredItems = category === "all" 
        ? menuItems 
        : menuItems.filter(item => item.category === category);

    // Jika produk tidak ditemukan
    if (filteredItems.length === 0) {
        menuContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777;">Menu tidak tersedia.</p>`;
        return;
    }

    // Buat kartu produk secara dinamis menggunakan perulangan (forEach)
    filteredItems.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("menu-card");

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price">Rp ${item.price.toLocaleString("id-ID")}</div>
            </div>
            <button class="add-btn" onclick="addToCart(${item.id})">+ Tambah</button>
        `;

        menuContainer.appendChild(card);
    });
}


/* ==========================================
   4. MANAJEMEN KERANJANG BELANJA (CART)
   ========================================== */

// Fungsi Menambah Item ke Keranjang
function addToCart(id) {
    const product = menuItems.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1; // Jika sudah ada, tambah jumlahnya (quantity)
    } else {
        cart.push({ ...product, quantity: 1 }); // Jika belum ada, masukkan sebagai item baru
    }

    updateCartUI();
}

// Fungsi Mengubah Jumlah (Tambah/Kurang) di Keranjang
function changeQuantity(id, amount) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += amount;

        // Jika jumlahnya habis (0), hapus dari keranjang
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    updateCartUI();
}

// Fungsi Memperbarui Tampilan Keranjang (UI & Kalkulasi Total)
function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Keranjang masih kosong.</p>`;
        totalCountEl.textContent = "0";
        totalPriceEl.textContent = "Rp 0";
        checkoutBtn.disabled = true; // Nonaktifkan tombol checkout jika kosong
        return;
    }

    let totalCount = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalCount += item.quantity;
        totalPrice += item.price * item.quantity;

        const cartRow = document.createElement("div");
        cartRow.classList.add("cart-item-row");

        cartRow.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>Rp ${item.price.toLocaleString("id-ID")} x ${item.quantity}</small>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartRow);
    });

    // Perbarui teks total di ringkasan keranjang
    totalCountEl.textContent = totalCount;
    totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString("id-ID")}`;
    checkoutBtn.disabled = false; // Aktifkan tombol checkout
}


/* ==========================================
   5. FILTER KATEGORI INTERAKTIF
   ========================================== */
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Hapus kelas 'active' dari semua tombol filter
        filterBtns.forEach(b => b.classList.remove("active"));
        // Tambahkan kelas 'active' ke tombol yang sedang diklik
        btn.classList.add("active");

        // Ambil kategori dari atribut data-category lalu tampilkan menunya
        const selectedCategory = btn.getAttribute("data-category");
        displayMenu(selectedCategory);
    });
});


/* ==========================================
   6. CHECKOUT & GENERATOR TIKET DIGITAL
   ========================================== */
checkoutBtn.addEventListener("click", () => {
    // 1. Buat nomor pesanan acak (contoh: #INV-4928)
    const randomInv = "#INV-" + Math.floor(1000 + Math.random() * 9000);
    ticketIdEl.textContent = randomInv;

    // 2. Ambil nomor meja yang diisi pelanggan
    ticketTableEl.textContent = tableNumberInput.value || "01";

    // 3. Pindahkan ringkasan item belanja ke dalam tampilan modal tiket
    ticketItemsSummary.innerHTML = "";
    let finalSumPrice = 0;

    cart.forEach(item => {
        let subTotal = item.price * item.quantity;
        finalSumPrice += subTotal;

        const p = document.createElement("div");
        p.style.display = "flex";
        p.style.justifyContent = "space-between";
        p.style.marginBottom = "4px";
        p.innerHTML = `<span>${item.quantity}x ${item.name}</span> <span>Rp ${subTotal.toLocaleString("id-ID")}</span>`;
        ticketItemsSummary.appendChild(p);
    });

    ticketTotalPriceEl.textContent = `Rp ${finalSumPrice.toLocaleString("id-ID")}`;

    // 4. Munculkan jendela modal tiket di layar
    ticketModal.classList.add("active");
});

// Tombol untuk mereset pesanan setelah selesai ditunjukkan ke kasir
newOrderBtn.addEventListener("click", () => {
    cart = []; // Kosongkan keranjang
    updateCartUI(); // Perbarui tampilan keranjang jadi kosong
    ticketModal.classList.remove("active"); // Sembunyikan modal tiket
});


/* ==========================================
   7. INISIALISASI AWAL KETIKA HALAMAN DIMUAT
   ========================================== */
// Jalankan fungsi menampilkan menu utama saat web pertama kali dibuka
displayMenu("all");
