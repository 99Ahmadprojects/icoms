document.addEventListener('DOMContentLoaded', () => {

    // === Sticky Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // === Mobile Hamburger Navigation ===
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        const isClickInsideNav = navLinks.contains(e.target) || hamburger.contains(e.target);
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // === Product Interaction Engine (Filtering & Live Search) ===
    const filterButtons = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('productSearch');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const productsSection = document.getElementById('products');
    const productsCountText = document.getElementById('productsCount');

    const filterProducts = () => {
        const activeCard = document.querySelector('.category-card.active');
        const activeFilter = activeCard ? activeCard.getAttribute('data-category') : 'all';
        // Extract exact text of clicked category
        const activeCategoryName = activeCard ? activeCard.querySelector('h3').innerText.trim() : 'All';
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visibleCount = 0;

        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.product-info h3').innerText.toLowerCase();

            // Match Logic
            const matchesCategory = (activeFilter === 'all' || activeFilter === cardCategory);
            const matchesSearch = (searchTerm === '' || cardTitle.includes(searchTerm));

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300); 
            }
        });

        // FIXED: Dynamically Update the Product Count Text based on the exact category clicked
        if (visibleCount === 0) {
            productsCountText.innerText = 'No products found';
            setTimeout(() => { noProductsMessage.style.display = 'block'; }, 300);
        } else {
            if (activeFilter === 'all') {
                productsCountText.innerText = `Showing all ${visibleCount} products`;
            } else {
                productsCountText.innerText = `Showing ${visibleCount} ${activeCategoryName} products`;
            }
            noProductsMessage.style.display = 'none';
        }
    };

    // Set Default State
    const defaultActive = document.querySelector('.category-card[data-category="all"]');
    if(defaultActive) defaultActive.classList.add('active');

    // Category Button Clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Swap active styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Reset search input logic
            if (searchInput) searchInput.value = '';

            // Run the filter to update products and text
            filterProducts();

            // Auto-scroll logic so user instantly sees the products they clicked
            if (productsSection) {
                const yOffset = -90; // accounts for the fixed sticky navbar
                const y = productsSection.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // Realtime Search Input Trigger
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // When typing, default to search "all" categories visually
            if (searchInput.value.trim() !== '') {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                if (defaultActive) defaultActive.classList.add('active');
            }
            filterProducts();
        });
    }
});