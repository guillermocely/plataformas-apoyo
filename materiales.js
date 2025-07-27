// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeAnimations();
    
    // Mostrar todas las fases por defecto
    showPhase('all');
});

// Inicializar navegación entre fases
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar la fase correspondiente
            const phase = this.getAttribute('data-phase');
            showPhase(phase);
        });
    });
}

// Mostrar fase específica
function showPhase(phase) {
    const sections = document.querySelectorAll('.phase-section');
    
    sections.forEach(section => {
        if (phase === 'all') {
            section.classList.remove('hidden');
        } else {
            if (section.getAttribute('data-phase') === phase) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    });
    
    // Reiniciar animaciones
    setTimeout(() => {
        initializeAnimations();
    }, 100);
}

// Inicializar búsqueda
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterContent(searchTerm);
    });
}

// Filtrar contenido basado en búsqueda
function filterContent(searchTerm) {
    const projectCards = document.querySelectorAll('.project-card');
    const materialLinks = document.querySelectorAll('.material-link');
    const docLinks = document.querySelectorAll('.doc-link');
    
    let visibleItems = 0;
    
    // Filtrar tarjetas de proyecto
    projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const isVisible = title.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'block';
            visibleItems++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Filtrar enlaces de materiales
    materialLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        
        if (isVisible) {
            link.style.display = 'flex';
            // Mostrar la tarjeta padre
            const parentCard = link.closest('.project-card');
            if (parentCard) {
                parentCard.style.display = 'block';
                visibleItems++;
            }
        } else if (searchTerm !== '') {
            link.style.display = 'none';
        } else {
            link.style.display = 'flex';
        }
    });
    
    // Filtrar enlaces de documentos
    docLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        
        if (isVisible) {
            link.style.display = 'flex';
            // Mostrar la tarjeta padre
            const parentCard = link.closest('.project-card');
            if (parentCard) {
                parentCard.style.display = 'block';
                visibleItems++;
            }
        } else if (searchTerm !== '') {
            link.style.display = 'none';
        } else {
            link.style.display = 'flex';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    updateNoResultsMessage(visibleItems === 0 && searchTerm !== '');
}

// Actualizar mensaje de "no hay resultados"
function updateNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #7f8c8d;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        document.querySelector('main').appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Alternar visibilidad de documentos
function toggleDocuments(button) {
    const documentsList = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (documentsList.style.display === 'none') {
        documentsList.style.display = 'grid';
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar documentos';
        button.style.background = '#e74c3c';
    } else {
        documentsList.style.display = 'none';
        button.innerHTML = '<i class="fas fa-eye"></i> Ver documentos';
        button.style.background = '#95a5a6';
    }
}

// Explorar carpeta (abrir en explorador de archivos)
function exploreFolder(path) {
    // Convertir path relativo a absoluto
    const absolutePath = path.replace('../', 'C:\\Users\\gefce\\Documents\\Portafolio del aprendiz\\4.Evidencias de aprendizaje\\analisis y desarrollo de software\\');
    
    // Mostrar mensaje informativo
    showNotification(`Abriendo carpeta: ${path}`, 'info');
    
    // Intentar abrir la carpeta (esto funcionará solo en entornos locales)
    try {
        window.open('file:///' + absolutePath.replace(/\\/g, '/'));
    } catch (error) {
        showNotification('No se puede abrir la carpeta directamente desde el navegador. Navega manualmente a: ' + absolutePath, 'warning');
    }
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'warning' ? 'exclamation-triangle' : 'check-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos para la notificación
    const notificationStyles = `
        <style>
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
            }
            
            .notification.info {
                background: #3498db;
                color: white;
            }
            
            .notification.warning {
                background: #f39c12;
                color: white;
            }
            
            .notification.success {
                background: #27ae60;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.8rem;
            }
            
            .notification-content i:first-child {
                font-size: 1.2rem;
            }
            
            .notification-content span {
                flex: 1;
                font-size: 0.9rem;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0.2rem;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        </style>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.innerHTML = notificationStyles;
        document.head.appendChild(styleElement);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Inicializar animaciones
function initializeAnimations() {
    const cards = document.querySelectorAll('.project-card');
    
    // Observer para animaciones de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Función para crear enlaces dinámicos a archivos
function createFileLink(filePath, fileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.className = 'doc-link';
    link.innerHTML = `
        <i class="fas fa-file-${getFileIcon(fileName)}"></i>
        ${fileName}
    `;
    link.target = '_blank';
    return link;
}

// Obtener icono según tipo de archivo
function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf':
            return 'pdf';
        case 'doc':
        case 'docx':
            return 'word';
        case 'xls':
        case 'xlsx':
            return 'excel';
        case 'ppt':
        case 'pptx':
            return 'powerpoint';
        case 'zip':
        case 'rar':
            return 'archive';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'image';
        case 'mp4':
        case 'avi':
        case 'mov':
            return 'video';
        case 'mp3':
        case 'wav':
            return 'audio';
        case 'html':
        case 'htm':
            return 'code';
        case 'js':
            return 'code';
        case 'css':
            return 'code';
        default:
            return 'alt';
    }
}

// Función para estadísticas
function updateStatistics() {
    const totalProjects = document.querySelectorAll('.project-card').length;
    const totalMaterials = document.querySelectorAll('.material-link').length;
    const totalDocuments = document.querySelectorAll('.doc-link').length;
    
    const statsContainer = document.createElement('div');
    statsContainer.className = 'statistics';
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <i class="fas fa-folder"></i>
                <span class="stat-number">${totalProjects}</span>
                <span class="stat-label">Proyectos</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-book"></i>
                <span class="stat-number">${totalMaterials}</span>
                <span class="stat-label">Materiales</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-file-alt"></i>
                <span class="stat-number">${totalDocuments}</span>
                <span class="stat-label">Documentos</span>
            </div>
        </div>
    `;
    
    // Insertar estadísticas después del header
    const header = document.querySelector('header');
    header.appendChild(statsContainer);
}

// Inicializar estadísticas
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateStatistics, 500);
});

// Hacer funciones globales para uso en HTML
window.toggleDocuments = toggleDocuments;
window.exploreFolder = exploreFolder;
