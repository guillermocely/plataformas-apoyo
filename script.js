// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase loading a las categorías para animación
    const categories = document.querySelectorAll('.category');
    categories.forEach((category, index) => {
        category.classList.add('loading');
        category.style.animationDelay = `${index * 0.2}s`;
    });

    // Agregar efecto de hover mejorado a las tarjetas
    const platformCards = document.querySelectorAll('.platform-card');
    
    platformCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Agregar funcionalidad de búsqueda
    createSearchBar();
    
    // Agregar contador de plataformas
    updatePlatformCounter();
    
    // Agregar funcionalidad de favoritos
    initializeFavorites();
});

// Crear barra de búsqueda
function createSearchBar() {
    const header = document.querySelector('header .container');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Buscar plataforma..." />
            <i class="fas fa-search search-icon"></i>
        </div>
    `;
    
    header.appendChild(searchContainer);
    
    // Agregar estilos para la búsqueda
    const searchStyles = `
        <style>
            .search-container {
                margin-top: 1.5rem;
                display: flex;
                justify-content: center;
            }
            
            .search-box {
                position: relative;
                max-width: 400px;
                width: 100%;
            }
            
            #searchInput {
                width: 100%;
                padding: 12px 45px 12px 15px;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                outline: none;
                transition: all 0.3s ease;
            }
            
            #searchInput:focus {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }
            
            .search-icon {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #667eea;
                font-size: 18px;
            }
            
            .platform-card.hidden {
                display: none;
            }
            
            .no-results {
                text-align: center;
                padding: 2rem;
                color: #718096;
                font-size: 1.1rem;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', searchStyles);
    
    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const platformCards = document.querySelectorAll('.platform-card');
        let visibleCards = 0;
        
        platformCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.classList.remove('hidden');
                visibleCards++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Mostrar mensaje si no hay resultados
        updateNoResultsMessage(visibleCards === 0 && searchTerm !== '');
    });
}

// Actualizar mensaje de "no hay resultados"
function updateNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = '<i class="fas fa-search"></i><br>No se encontraron plataformas que coincidan con tu búsqueda';
        document.querySelector('main').appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Contador de plataformas
function updatePlatformCounter() {
    const totalPlatforms = document.querySelectorAll('.platform-card').length;
    const counterElement = document.createElement('div');
    counterElement.className = 'platform-counter';
    counterElement.innerHTML = `
        <p><i class="fas fa-layer-group"></i> ${totalPlatforms} plataformas disponibles</p>
    `;
    
    const counterStyles = `
        <style>
            .platform-counter {
                text-align: center;
                margin-bottom: 2rem;
                color: rgba(255, 255, 255, 0.8);
                font-size: 1.1rem;
            }
            
            .platform-counter i {
                margin-right: 0.5rem;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', counterStyles);
    document.querySelector('main').insertBefore(counterElement, document.querySelector('.platforms-grid'));
}

// Sistema de favoritos
function initializeFavorites() {
    const platformCards = document.querySelectorAll('.platform-card');
    
    platformCards.forEach(card => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.title = 'Agregar a favoritos';
        
        card.appendChild(favoriteBtn);
        
        // Cargar estado de favoritos desde localStorage
        const platformName = card.querySelector('h3').textContent;
        const favorites = JSON.parse(localStorage.getItem('platformFavorites') || '[]');
        
        if (favorites.includes(platformName)) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.title = 'Quitar de favoritos';
        }
        
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFavorite(platformName, favoriteBtn);
        });
    });
    
    // Estilos para favoritos
    const favoriteStyles = `
        <style>
            .favorite-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #ccc;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 5px;
                border-radius: 50%;
            }
            
            .favorite-btn:hover {
                color: #e53e3e;
                transform: scale(1.1);
            }
            
            .favorite-btn.active {
                color: #e53e3e;
            }
            
            .platform-card {
                position: relative;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', favoriteStyles);
}

// Toggle favorito
function toggleFavorite(platformName, button) {
    let favorites = JSON.parse(localStorage.getItem('platformFavorites') || '[]');
    
    if (favorites.includes(platformName)) {
        favorites = favorites.filter(name => name !== platformName);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.title = 'Agregar a favoritos';
    } else {
        favorites.push(platformName);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.title = 'Quitar de favoritos';
    }
    
    localStorage.setItem('platformFavorites', JSON.stringify(favorites));
}

// Agregar efecto de scroll suave para navegación
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar scroll suave
smoothScroll();

// Agregar animación de entrada para las tarjetas
function animateCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    const cards = document.querySelectorAll('.platform-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Inicializar animaciones
animateCards();
