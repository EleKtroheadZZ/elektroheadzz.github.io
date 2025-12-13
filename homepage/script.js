// ========================================
// GIST SYNC CONFIGURATION
// ========================================
// To enable cloud sync via GitHub Gist:
// 1. Set enabled to true
// 2. Add your GitHub Personal Access Token (with 'gist' scope)
// 3. Add your Gist ID
// Get token at: https://github.com/settings/tokens

const GIST_CONFIG = {
    enabled: false, // Disabled - using Export/Import instead
    token: '', // Not needed for Export/Import
    gistId: '', // Not needed for Export/Import
    filename: 'homepage-data.json',
    autoSyncDelay: 2000
};

// ========================================
// DEFAULT DATA
// ========================================

// Default website shortcuts data - categorized
const defaultCategories = [
    {
        id: 'productivity',
        name: '🎯 Work & Productivity',
        icon: '🎯',
        websites: [
            { name: 'Notion', url: 'https://www.notion.so', domain: 'notion.so', customIcon: 'https://www.notion.so/images/favicon.ico' },
            { name: 'Trello', url: 'https://trello.com', domain: 'trello.com', customIcon: 'https://trello.com/favicon.ico' },
            { name: 'Gmail', url: 'https://mail.google.com', domain: 'mail.google.com', customIcon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
            { name: 'Google Drive', url: 'https://drive.google.com', domain: 'drive.google.com', customIcon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png' }
        ]
    },
    {
        id: 'development',
        name: '💻 Development & Tech',
        icon: '💻',
        websites: [
            { name: 'GitHub', url: 'https://github.com', domain: 'github.com', customIcon: 'https://github.githubassets.com/favicons/favicon.png' },
            { name: 'Stack Overflow', url: 'https://stackoverflow.com', domain: 'stackoverflow.com', customIcon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico' },
            { name: 'Figma', url: 'https://www.figma.com', domain: 'figma.com', customIcon: 'https://static.figma.com/app/icon/1/favicon.png' },
            { name: 'ChatGPT', url: 'https://chat.openai.com', domain: 'openai.com', customIcon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg' }
        ]
    },
    {
        id: 'social',
        name: '🌐 Social & Media',
        icon: '🌐',
        websites: [
            { name: 'X (Twitter)', url: 'https://twitter.com', domain: 'twitter.com', customIcon: 'https://abs.twimg.com/favicons/twitter.3.ico' },
            { name: 'Instagram', url: 'https://www.instagram.com', domain: 'instagram.com', customIcon: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png' },
            { name: 'Reddit', url: 'https://www.reddit.com', domain: 'reddit.com', customIcon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com', domain: 'linkedin.com', customIcon: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca' },
            { name: 'Discord', url: 'https://discord.com', domain: 'discord.com', customIcon: 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png' },
            { name: 'Medium', url: 'https://medium.com', domain: 'medium.com', customIcon: 'https://medium.com/favicon.ico' }
        ]
    },
    {
        id: 'entertainment',
        name: '🎮 Entertainment & Gaming',
        icon: '🎮',
        websites: [
            { name: 'Chess.com', url: 'https://www.chess.com', domain: 'chess.com' },
            { name: 'Wordle', url: 'https://www.nytimes.com/games/wordle', domain: 'nytimes.com' },
            { name: 'Skribbl', url: 'https://skribbl.io', domain: 'skribbl.io' },
            { name: 'Spotify', url: 'https://www.spotify.com', domain: 'spotify.com', customIcon: 'https://www.spotify.com/favicon.ico' },
            { name: 'Netflix', url: 'https://www.netflix.com', domain: 'netflix.com', customIcon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico' },
            { name: 'Twitch', url: 'https://www.twitch.tv', domain: 'twitch.tv', customIcon: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png' }
        ]
    },
    {
        id: 'knowledge',
        name: '📚 Search & Knowledge',
        icon: '📚',
        websites: [
            { name: 'Google', url: 'https://www.google.com', domain: 'google.com', customIcon: 'https://www.google.com/favicon.ico' },
            { name: 'YouTube', url: 'https://www.youtube.com', domain: 'youtube.com', customIcon: 'https://www.youtube.com/s/desktop/d743f786/img/favicon_144x144.png' },
            { name: 'Wikipedia', url: 'https://www.wikipedia.org', domain: 'wikipedia.org', customIcon: 'https://www.wikipedia.org/static/favicon/wikipedia.ico' },
            { name: 'Amazon', url: 'https://www.amazon.com', domain: 'amazon.com', customIcon: 'https://www.amazon.com/favicon.ico' },
            { name: 'Mega', url: 'https://mega.nz', domain: 'mega.nz' }
        ]
    }
];

// Load categories from localStorage or use defaults
let categories = [];

async function loadCategories() {
    // Try loading from Gist first if enabled
    if (GIST_CONFIG.enabled) {
        const cloudData = await loadFromGist();
        
        if (cloudData && cloudData.categories) {
            categories = cloudData.categories;
            
            // Also restore other settings from cloud
            if (cloudData.categoryStates) {
                localStorage.setItem('categoryStates', JSON.stringify(cloudData.categoryStates));
            }
            if (cloudData.darkMode) {
                localStorage.setItem('darkMode', cloudData.darkMode);
            }
            
            // Save to localStorage as backup
            saveCategories();
            return;
        }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('categories');
    
    if (saved) {
        categories = JSON.parse(saved);
    } else {
        // Check for old flat websites array and migrate
        const oldWebsites = localStorage.getItem('websites');
        if (oldWebsites) {
            migrateToCategories(JSON.parse(oldWebsites));
        } else {
            categories = JSON.parse(JSON.stringify(defaultCategories)); // Deep copy
            saveCategories();
        }
    }
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
    
    // Schedule auto-sync to Gist if enabled
    scheduleAutoSync();
}

// Migration function for existing users
function migrateToCategories(oldWebsites) {
    console.log('Migrating from flat structure to categories...');
    
    // Start with default categories
    categories = JSON.parse(JSON.stringify(defaultCategories));
    
    // Mapping of domains to category IDs for smart categorization
    const categoryMapping = {
        'notion.so': 'productivity',
        'trello.com': 'productivity',
        'mail.google.com': 'productivity',
        'drive.google.com': 'productivity',
        'github.com': 'development',
        'stackoverflow.com': 'development',
        'figma.com': 'development',
        'openai.com': 'development',
        'twitter.com': 'social',
        'instagram.com': 'social',
        'reddit.com': 'social',
        'linkedin.com': 'social',
        'discord.com': 'social',
        'medium.com': 'social',
        'chess.com': 'entertainment',
        'nytimes.com': 'entertainment',
        'skribbl.io': 'entertainment',
        'spotify.com': 'entertainment',
        'netflix.com': 'entertainment',
        'twitch.tv': 'entertainment',
        'google.com': 'knowledge',
        'youtube.com': 'knowledge',
        'wikipedia.org': 'knowledge',
        'amazon.com': 'knowledge',
        'mega.nz': 'knowledge'
    };
    
    // Process old websites
    oldWebsites.forEach(site => {
        // Find matching category
        const categoryId = categoryMapping[site.domain] || 'productivity'; // Default to productivity
        const category = categories.find(cat => cat.id === categoryId);
        
        if (category) {
            // Check if site already exists (avoid duplicates)
            const exists = category.websites.some(w => w.domain === site.domain);
            if (!exists) {
                category.websites.push(site);
            }
        }
    });
    
    saveCategories();
    console.log('Migration complete!');
}

// Generate favicon URL with multiple fallback sources
function getFaviconUrl(domain) {
    // Google's favicon service - most reliable and widely compatible
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// Extract clean root domain (e.g., https://www.example.com/path -> example.com)
function getRootDomain(input) {
    try {
        let hostname;
        // If input looks like a URL with protocol
        if (input.includes('://')) {
            const urlObj = new URL(input);
            hostname = urlObj.hostname;
        } else if (input.includes('/')) {
            // Has path but no protocol, add protocol temporarily
            const urlObj = new URL('https://' + input);
            hostname = urlObj.hostname;
        } else {
            // Just a hostname
            hostname = input;
        }
        
        // Remove www. prefix if present
        hostname = hostname.replace(/^www\./, '');
        
        // Extract root domain (e.g., mail.google.com -> google.com)
        const parts = hostname.split('.');
        if (parts.length > 2) {
            // Handle cases like co.uk, com.au, etc.
            return parts.slice(-2).join('.');
        }
        return hostname;
    } catch (e) {
        // If parsing fails, try simple extraction
        let cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '');
        cleaned = cleaned.split('/')[0]; // Remove path
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            return parts.slice(-2).join('.');
        }
        return cleaned;
    }
}

function getCategoryDisplayName(category) {
    if (!category) return '';
    let name = (category.name || '').trim();
    const icon = (category.icon || '').trim();
    
    if (icon && name) {
        // Remove icon from anywhere in the name string (start, middle, or end)
        // Escape special regex characters in the icon
        const escapedIcon = icon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        name = name.replace(new RegExp(escapedIcon, 'g'), '').trim();
        
        // Also remove common separators that might be left over
        name = name.replace(/^[-\s]+|[-\s]+$/g, '').trim();
    }
    
    return name || category.name || '';
}

function formatCategoryLabel(category) {
    const displayName = getCategoryDisplayName(category) || category.name || 'Untitled';
    const icon = (category.icon || '').trim();
    return icon ? `${icon} ${displayName}` : displayName;
}

function generateCategoryId(name) {
    const base = (name || 'section')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section';
    const existingIds = new Set(categories.map(cat => cat.id));
    let uniqueId = base;
    let counter = 1;
    while (existingIds.has(uniqueId)) {
        uniqueId = `${base}-${counter}`;
        counter++;
    }
    return uniqueId;
}

// ========================================
// GIST SYNC FUNCTIONALITY
// ========================================

let syncTimeout = null;
let isSyncing = false;

// Load data from GitHub Gist
async function loadFromGist() {
    if (!GIST_CONFIG.enabled || !GIST_CONFIG.token || !GIST_CONFIG.gistId) {
        console.log('Gist sync disabled or not configured');
        return null;
    }

    try {
        showSyncStatus('Loading from cloud...', 'loading');
        
        const response = await fetch(`https://api.github.com/gists/${GIST_CONFIG.gistId}`, {
            headers: {
                'Authorization': `token ${GIST_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const gist = await response.json();
        const fileContent = gist.files[GIST_CONFIG.filename]?.content;

        if (!fileContent) {
            console.log('No data found in Gist, will create on first sync');
            return null;
        }

        const data = JSON.parse(fileContent);
        console.log('Successfully loaded data from Gist');
        showSyncStatus('Loaded from cloud ✓', 'success');
        
        return data;
    } catch (error) {
        console.error('Error loading from Gist:', error);
        showSyncStatus('Cloud sync failed (using local)', 'error');
        return null;
    }
}

// Save data to GitHub Gist
async function saveToGist() {
    if (!GIST_CONFIG.enabled || !GIST_CONFIG.token || !GIST_CONFIG.gistId) {
        return;
    }

    if (isSyncing) {
        console.log('Sync already in progress, skipping...');
        return;
    }

    try {
        isSyncing = true;
        showSyncStatus('Syncing...', 'loading');

        const data = {
            categories: categories,
            categoryStates: JSON.parse(localStorage.getItem('categoryStates') || '{}'),
            darkMode: localStorage.getItem('darkMode'),
            websites: JSON.parse(localStorage.getItem('websites') || '[]'),
            lastSync: new Date().toISOString()
        };

        const response = await fetch(`https://api.github.com/gists/${GIST_CONFIG.gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GIST_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [GIST_CONFIG.filename]: {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        console.log('Successfully synced to Gist');
        showSyncStatus('Synced ✓', 'success');
        
        // Hide success message after 2 seconds
        setTimeout(() => {
            const indicator = document.getElementById('sync-indicator');
            if (indicator && indicator.textContent === 'Synced ✓') {
                indicator.style.opacity = '0';
            }
        }, 2000);

    } catch (error) {
        console.error('Error syncing to Gist:', error);
        showSyncStatus('Sync failed', 'error');
    } finally {
        isSyncing = false;
    }
}

// Debounced auto-sync function
function scheduleAutoSync() {
    if (!GIST_CONFIG.enabled) return;

    if (syncTimeout) {
        clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(() => {
        saveToGist();
    }, GIST_CONFIG.autoSyncDelay);
}

// Merge local and cloud data
function mergeData(cloudData, localCategories) {
    if (!cloudData || !cloudData.categories) {
        return localCategories;
    }

    // Simple strategy: use cloud data if it exists
    // In future, could implement more sophisticated merge logic
    console.log('Using cloud data');
    return cloudData.categories;
}

// Show sync status indicator
function showSyncStatus(message, type) {
    let indicator = document.getElementById('sync-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'sync-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            z-index: 10000;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;
        document.body.appendChild(indicator);
    }

    indicator.textContent = message;
    indicator.style.opacity = '1';

    // Set colors based on type
    if (type === 'loading') {
        indicator.style.background = 'rgba(102, 126, 234, 0.9)';
        indicator.style.color = 'white';
    } else if (type === 'success') {
        indicator.style.background = 'rgba(52, 211, 153, 0.9)';
        indicator.style.color = 'white';
    } else if (type === 'error') {
        indicator.style.background = 'rgba(248, 113, 113, 0.9)';
        indicator.style.color = 'white';
    }

    // Auto-hide error messages after 3 seconds
    if (type === 'error') {
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 3000);
    }
}

// Drag and drop variables
let draggedElement = null;
let draggedCategoryIndex = null;
let draggedItemIndex = null;
let placeholder = null;

// Section drag variables
let draggedSectionIndex = null;
let draggedSectionElement = null;
let sectionPlaceholder = null;

// Cache DOM elements for better performance
const elements = {
    grid: null,
    darkModeToggle: null,
    toggleIcon: null,
    addModal: null,
    editModal: null,
    sectionModal: null,
    sectionForm: null,
    sectionNameInput: null,
    sectionIconInput: null,
    addSectionBtn: null
};

// Initialize cached elements
function initElements() {
    elements.grid = document.getElementById('shortcutsGrid');
    elements.darkModeToggle = document.getElementById('darkModeToggle');
    elements.toggleIcon = elements.darkModeToggle.querySelector('.toggle-icon');
    elements.addModal = document.getElementById('addSiteModal');
    elements.editModal = document.getElementById('editSiteModal');
    elements.sectionModal = document.getElementById('sectionModal');
    elements.sectionForm = document.getElementById('sectionForm');
    elements.sectionNameInput = document.getElementById('sectionName');
    elements.sectionIconInput = document.getElementById('sectionIcon');
    elements.addSectionBtn = document.getElementById('addSectionBtn');
}

// Render shortcuts grid with categories
function renderShortcuts() {
    const grid = elements.grid || document.getElementById('shortcutsGrid');
    grid.innerHTML = '';
    
    categories.forEach((category, categoryIndex) => {
        // Create category section
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.setAttribute('data-category-id', category.id);
        
        // Create category header (draggable for section reordering)
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.draggable = true;
        categoryHeader.setAttribute('data-section-index', categoryIndex);
        
        // Add drag handle icon
        const dragHandle = document.createElement('span');
        dragHandle.className = 'section-drag-handle';
        dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
        dragHandle.title = 'Drag to reorder section';
        
        const headerContent = document.createElement('div');
        headerContent.className = 'category-header-content';
        
        const categoryIcon = document.createElement('span');
        categoryIcon.className = 'category-icon';
        categoryIcon.textContent = (category.icon && category.icon.trim()) || '📁';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        const displayName = getCategoryDisplayName(category) || category.name || 'Untitled Section';
        categoryTitle.textContent = displayName;
        
        headerContent.appendChild(categoryIcon);
        headerContent.appendChild(categoryTitle);
        
        categoryHeader.appendChild(dragHandle);
        
        const countBadge = document.createElement('span');
        countBadge.className = 'category-count';
        countBadge.textContent = category.websites.length;
        
        const editSectionBtn = document.createElement('button');
        editSectionBtn.className = 'section-edit-btn';
        editSectionBtn.type = 'button';
        editSectionBtn.setAttribute('aria-label', `Edit ${displayName} section`);
        editSectionBtn.innerHTML = '<i class="fas fa-pen"></i>';
        editSectionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openSectionModal('edit', categoryIndex);
        });
        
        categoryHeader.appendChild(headerContent);
        categoryHeader.appendChild(countBadge);
        categoryHeader.appendChild(editSectionBtn);
        
        // Add section drag event listeners
        categoryHeader.addEventListener('dragstart', handleSectionDragStart);
        categoryHeader.addEventListener('dragend', handleSectionDragEnd);
        
        // Create category grid (always visible)
        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'category-grid';
        categoryGrid.setAttribute('data-category-index', categoryIndex);
        
        // Add grid-level drag-over handlers
        categoryGrid.addEventListener('dragenter', function(e) {
            if (e.target === this || this.contains(e.target)) {
                this.classList.add('drag-over');
            }
        });
        
        categoryGrid.addEventListener('dragleave', function(e) {
            if (e.target === this || !this.contains(e.relatedTarget)) {
                this.classList.remove('drag-over');
            }
        });
        
        categoryGrid.addEventListener('dragover', handleDragOver);
        
        categoryGrid.addEventListener('drop', function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.preventDefault();
            
            this.classList.remove('drag-over');
            
            if (!draggedElement) return false;
            
            const dropCategoryIndex = parseInt(this.getAttribute('data-category-index'));
            const draggedSite = categories[draggedCategoryIndex].websites[draggedItemIndex];
            
            // Calculate drop position (end of category if dropping on empty space)
            let dropItemIndex = categories[dropCategoryIndex].websites.length;
            
            // If placeholder exists, use its position
            if (placeholder && placeholder.parentNode === this) {
                const itemsBefore = Array.from(this.children)
                    .slice(0, Array.from(this.children).indexOf(placeholder))
                    .filter(child => 
                        child.classList.contains('shortcut-item') && 
                        !child.classList.contains('add-site-btn') &&
                        !child.classList.contains('placeholder')
                    ).length;
                dropItemIndex = itemsBefore;
            }
            
            // Move the website
            categories[draggedCategoryIndex].websites.splice(draggedItemIndex, 1);
            
            // Adjust if moving within same category
            if (draggedCategoryIndex === dropCategoryIndex && draggedItemIndex < dropItemIndex) {
                dropItemIndex--;
            }
            
            categories[dropCategoryIndex].websites.splice(dropItemIndex, 0, draggedSite);
            
            saveCategories();
            
            // Update affected grids
            const affectedCategories = [draggedCategoryIndex];
            if (draggedCategoryIndex !== dropCategoryIndex) {
                affectedCategories.push(dropCategoryIndex);
            }
            
            affectedCategories.forEach(catIndex => updateCategoryGrid(catIndex));
            
            return false;
        });
        
        // Render all websites (no conditional rendering)
        category.websites.forEach((site, itemIndex) => {
            const shortcut = createShortcutElement(site, categoryIndex, itemIndex);
            categoryGrid.appendChild(shortcut);
        });
        
        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(categoryGrid);
        grid.appendChild(categorySection);
    });
    
    // Add section drag-over and drop handlers to the grid container
    grid.addEventListener('dragover', handleSectionDragOver);
    grid.addEventListener('drop', handleSectionDrop);
    
    // Add "Add Site" button at the end
    const addButton = document.createElement('div');
    addButton.className = 'shortcut-item add-site-btn';
    addButton.setAttribute('data-name', 'Add Site');
    addButton.setAttribute('role', 'button');
    addButton.setAttribute('aria-label', 'Add new website shortcut');
    addButton.setAttribute('tabindex', '0');
    addButton.innerHTML = `
        <div class="shortcut-icon">
            <i class="fas fa-plus add-icon"></i>
        </div>
    `;
    addButton.addEventListener('click', showAddSiteModal);
    addButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showAddSiteModal();
        }
    });
    grid.appendChild(addButton);
}

// Helper: Update only specific category grid without full reload
function updateCategoryGrid(categoryIndex) {
    const category = categories[categoryIndex];
    const categoryGrid = document.querySelector(`.category-grid[data-category-index="${categoryIndex}"]`);
    
    if (!categoryGrid) return;
    
    // Remove placeholder if it belongs to this grid
    if (placeholder && placeholder.parentNode === categoryGrid) {
        placeholder.parentNode.removeChild(placeholder);
    }
    
    // Remove existing shortcuts (keep add button if it's the last grid)
    const existingShortcuts = Array.from(categoryGrid.children).filter(
        child => child.classList.contains('shortcut-item') && !child.classList.contains('add-site-btn')
    );
    existingShortcuts.forEach(item => item.remove());
    
    // Re-create shortcuts with fresh data
    category.websites.forEach((site, itemIndex) => {
        const shortcut = createShortcutElement(site, categoryIndex, itemIndex);
        categoryGrid.appendChild(shortcut);
    });
    
    // Update category count
    updateCategoryCount(categoryIndex);
}

// Helper: Create shortcut element
function createShortcutElement(site, categoryIndex, itemIndex) {
    const shortcut = document.createElement('div');
    shortcut.className = 'shortcut-item';
    shortcut.setAttribute('data-name', site.name);
    shortcut.setAttribute('data-category-index', categoryIndex);
    shortcut.setAttribute('data-item-index', itemIndex);
    shortcut.setAttribute('draggable', 'true');
    const column = itemIndex % 4;
    const row = Math.floor(itemIndex / 4);
    const delay = (categoryIndex * 0.2) + (row * 0.06) + (column * 0.02);
    shortcut.style.animationDelay = `${delay}s`;
    
    // Add drag event listeners
    shortcut.addEventListener('dragstart', handleDragStart);
    shortcut.addEventListener('dragover', handleDragOver);
    shortcut.addEventListener('drop', handleDrop);
    shortcut.addEventListener('dragend', handleDragEnd);
    shortcut.addEventListener('dragenter', handleDragEnter);
    shortcut.addEventListener('dragleave', handleDragLeave);
    
    const link = document.createElement('a');
    link.href = site.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'shortcut-link';
    link.setAttribute('aria-label', `Visit ${site.name}`);
    link.addEventListener('click', (e) => {
        if (shortcut.classList.contains('dragging')) {
            e.preventDefault();
        }
    });
    
    const icon = document.createElement('div');
    icon.className = 'shortcut-icon';
    
    const img = document.createElement('img');
    img.src = site.customIcon || getFaviconUrl(site.domain);
    img.alt = site.name;
    img.loading = 'lazy';
    img.draggable = false;
    
    img.onerror = function() {
        if (!this.dataset.attempted) {
            this.dataset.attempted = 'true';
            this.src = `https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`;
        } else if (!this.dataset.attempted2) {
            this.dataset.attempted2 = 'true';
            this.src = `https://logo.clearbit.com/${site.domain}`;
        } else if (!this.dataset.attempted3) {
            this.dataset.attempted3 = 'true';
            this.src = `https://icons.duckduckgo.com/ip3/${site.domain}.ico`;
        } else if (!this.dataset.attempted4) {
            this.dataset.attempted4 = 'true';
            this.src = `https://api.faviconkit.com/${site.domain}/128`;
        } else if (!this.dataset.attempted5) {
            this.dataset.attempted5 = 'true';
            try {
                const urlObj = new URL(site.url);
                this.src = `${urlObj.origin}/favicon.ico`;
            } catch (e) {
                this.style.display = 'none';
                icon.innerHTML = `<span style="font-size: 24px; font-weight: 600; color: var(--text-color);">${site.name.charAt(0).toUpperCase()}</span>`;
            }
        } else {
            this.style.display = 'none';
            icon.innerHTML = `<span style="font-size: 24px; font-weight: 600; color: var(--text-color);">${site.name.charAt(0).toUpperCase()}</span>`;
        }
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.setAttribute('aria-label', `Remove ${site.name} from shortcuts`);
    deleteBtn.setAttribute('title', 'Remove site');
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteSite(categoryIndex, itemIndex);
    });
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.setAttribute('aria-label', `Edit ${site.name}`);
    editBtn.setAttribute('title', 'Edit site');
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showEditSiteModal(categoryIndex, itemIndex);
    });
    
    icon.appendChild(img);
    link.appendChild(icon);
    shortcut.appendChild(link);
    shortcut.appendChild(editBtn);
    shortcut.appendChild(deleteBtn);
    
    return shortcut;
}

// Helper: Update category count badge
function updateCategoryCount(categoryIndex) {
    const category = categories[categoryIndex];
    const categorySection = document.querySelector(`.category-section[data-category-id="${category.id}"]`);
    if (categorySection) {
        const countBadge = categorySection.querySelector('.category-count');
        if (countBadge) {
            countBadge.textContent = category.websites.length;
        }
    }
}

// Helper: Find element after which to insert (based on cursor position)
function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.shortcut-item:not(.dragging):not(.add-site-btn):not(.placeholder)')];
    
    // If grid is empty, return null to append at end
    if (draggableElements.length === 0) {
        return null;
    }
    
    let closestElement = null;
    let closestOffset = Number.POSITIVE_INFINITY;
    
    draggableElements.forEach(child => {
        const box = child.getBoundingClientRect();
        
        // Calculate center of the element
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        
        // Calculate distance from cursor to center
        const offsetX = x - centerX;
        const offsetY = y - centerY;
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        
        // If cursor is past this element (to the right or below), consider it
        const isPastElement = (y > box.top && (x > box.left + box.width || y > box.bottom));
        
        if (distance < closestOffset) {
            closestOffset = distance;
            closestElement = child;
        }
    });
    
    // If we found an element, check if cursor is after it
    if (closestElement) {
        const box = closestElement.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        
        // If cursor is to the right or below the center, insert after this element
        if (x > centerX || (y > centerY && x > box.left)) {
            // Return the next sibling or null to insert at end
            const nextElement = closestElement.nextElementSibling;
            return (nextElement && !nextElement.classList.contains('add-site-btn')) ? nextElement : null;
        }
        
        return closestElement;
    }
    
    return null;
}

// Drag and drop handlers
function handleDragStart(e) {
    // Prevent app dragging when section is being dragged
    if (draggedSectionIndex !== null) {
        e.preventDefault();
        return;
    }
    
    draggedElement = this;
    draggedCategoryIndex = parseInt(this.getAttribute('data-category-index'));
    draggedItemIndex = parseInt(this.getAttribute('data-item-index'));
    
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    
    // Create placeholder
    placeholder = document.createElement('div');
    placeholder.className = 'shortcut-item placeholder';
    placeholder.style.width = this.offsetWidth + 'px';
    placeholder.style.height = this.offsetHeight + 'px';
    
    // Slight delay for drag effect
    setTimeout(() => {
        if (draggedElement) {
            draggedElement.style.opacity = '0.4';
        }
    }, 0);
}

function handleDragOver(e) {
    // Ignore if section is being dragged
    if (draggedSectionIndex !== null) return false;
    
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedElement || !placeholder) return false;
    
    // Find the closest category-grid
    const target = e.target.closest('.category-grid');
    if (!target) return false;
    
    // Don't insert placeholder if hovering over the dragged element itself
    if (e.target === draggedElement || draggedElement.contains(e.target)) {
        return false;
    }
    
    // Calculate where to insert placeholder
    const afterElement = getDragAfterElement(target, e.clientX, e.clientY);
    
    // Remove placeholder from its current position if it exists
    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    
    if (afterElement == null) {
        // Append at the end
        target.appendChild(placeholder);
    } else {
        // Insert before the afterElement
        target.insertBefore(placeholder, afterElement);
    }
    
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement && !this.classList.contains('add-site-btn')) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    // Only remove if actually leaving, not moving to child
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (!draggedElement) return false;
    
    const targetGrid = e.target.closest('.category-grid');
    if (!targetGrid) return false;
    
    const dropCategoryIndex = parseInt(targetGrid.getAttribute('data-category-index'));
    
    // Calculate drop position based on placeholder location
    let dropItemIndex = 0;
    if (placeholder && placeholder.parentNode) {
        const allItems = Array.from(placeholder.parentNode.children).filter(
            child => child.classList.contains('shortcut-item') && 
                    !child.classList.contains('add-site-btn') &&
                    !child.classList.contains('placeholder')
        );
        const placeholderIndex = Array.from(placeholder.parentNode.children).indexOf(placeholder);
        const itemsBefore = Array.from(placeholder.parentNode.children)
            .slice(0, placeholderIndex)
            .filter(child => 
                child.classList.contains('shortcut-item') && 
                !child.classList.contains('add-site-btn') &&
                !child.classList.contains('placeholder')
            ).length;
        dropItemIndex = itemsBefore;
    }
    
    // Move the website in data
    const draggedSite = categories[draggedCategoryIndex].websites[draggedItemIndex];
    
    categories[draggedCategoryIndex].websites.splice(draggedItemIndex, 1);
    
    // Adjust dropItemIndex if moving within same category and moving down
    if (draggedCategoryIndex === dropCategoryIndex && draggedItemIndex < dropItemIndex) {
        dropItemIndex--;
    }
    
    categories[dropCategoryIndex].websites.splice(dropItemIndex, 0, draggedSite);
    
    saveCategories();
    
    // Only update affected grids (no full reload!)
    const affectedCategories = [draggedCategoryIndex];
    if (draggedCategoryIndex !== dropCategoryIndex) {
        affectedCategories.push(dropCategoryIndex);
    }
    
    affectedCategories.forEach(catIndex => updateCategoryGrid(catIndex));
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '';
    
    // Remove all drag-over classes
    document.querySelectorAll('.shortcut-item, .category-grid').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    // Remove placeholder
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    
    draggedElement = null;
    draggedCategoryIndex = null;
    draggedItemIndex = null;
    placeholder = null;
}

// ========================================
// SECTION DRAG AND DROP HANDLERS
// ========================================

function handleSectionDragStart(e) {
    // Prevent app dragging when dragging section
    if (draggedElement) return;
    
    const header = this;
    const section = header.parentElement;
    
    draggedSectionElement = section;
    draggedSectionIndex = parseInt(header.getAttribute('data-section-index'));
    
    console.log('Starting drag of section:', draggedSectionIndex);
    
    header.style.opacity = '0.4';
    section.classList.add('dragging-section');
    
    // Create section placeholder
    sectionPlaceholder = document.createElement('div');
    sectionPlaceholder.className = 'section-placeholder';
    sectionPlaceholder.style.height = section.offsetHeight + 'px';
    
    // Set drag image
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', header.innerHTML);
}

function handleSectionDragOver(e) {
    if (draggedSectionIndex === null) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const grid = e.currentTarget;
    const afterElement = getSectionAfterElement(grid, e.clientY);
    
    if (afterElement == null) {
        grid.appendChild(sectionPlaceholder);
    } else {
        grid.insertBefore(sectionPlaceholder, afterElement);
    }
}

function getSectionAfterElement(gridContainer, y) {
    const draggableElements = [...gridContainer.querySelectorAll('.category-section:not(.dragging-section)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleSectionDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedSectionIndex === null) {
        console.log('No section being dragged');
        return;
    }
    
    if (!sectionPlaceholder || !sectionPlaceholder.parentNode) {
        console.log('No placeholder found');
        return;
    }
    
    // Get all sections excluding the placeholder and dragged section
    const grid = document.getElementById('shortcutsGrid');
    const allChildren = [...grid.children];
    
    // Find placeholder position among all children
    const placeholderIndex = allChildren.indexOf(sectionPlaceholder);
    
    if (placeholderIndex === -1) {
        console.log('Placeholder not in DOM');
        return;
    }
    
    // Count only category-section elements before placeholder
    let newIndex = 0;
    for (let i = 0; i < placeholderIndex; i++) {
        if (allChildren[i].classList.contains('category-section') && 
            !allChildren[i].classList.contains('dragging-section')) {
            newIndex++;
        }
    }
    
    console.log(`Moving section from ${draggedSectionIndex} to ${newIndex}`);
    
    // Only move if position changed
    if (draggedSectionIndex !== newIndex) {
        // Move category in array
        const movedCategory = categories.splice(draggedSectionIndex, 1)[0];
        categories.splice(newIndex, 0, movedCategory);
        
        console.log('Categories reordered:', categories.map(c => getCategoryDisplayName(c)));
        
        // Save and re-render
        saveCategories();
        renderShortcuts();
        
        // Show notification
        showNotification(`Section "${getCategoryDisplayName(movedCategory)}" moved`, 'success');
    }
}

function handleSectionDragEnd(e) {
    const header = this;
    const section = header.parentElement;
    
    header.style.opacity = '';
    section.classList.remove('dragging-section');
    
    console.log('Drag ended');
    
    // Remove placeholder
    if (sectionPlaceholder && sectionPlaceholder.parentNode) {
        sectionPlaceholder.parentNode.removeChild(sectionPlaceholder);
    }
    
    // Remove drag-over class from all sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('drag-over');
    });
    
    draggedSectionElement = null;
    draggedSectionIndex = null;
    sectionPlaceholder = null;
}

// Delete site
function deleteSite(categoryIndex, itemIndex) {
    const site = categories[categoryIndex].websites[itemIndex];
    if (confirm(`Remove "${site.name}" from shortcuts?`)) {
        categories[categoryIndex].websites.splice(itemIndex, 1);
        saveCategories();
        updateCategoryGrid(categoryIndex);
    }
}

// Edit site modal
let editingCategoryIndex = null;
let editingItemIndex = null;
let sectionModalMode = 'add';
let editingSectionIndex = null;

function showEditSiteModal(categoryIndex, itemIndex) {
    editingCategoryIndex = categoryIndex;
    editingItemIndex = itemIndex;
    const site = categories[categoryIndex].websites[itemIndex];
    const modal = document.getElementById('editSiteModal');
    document.getElementById('editSiteName').value = site.name;
    document.getElementById('editSiteUrl').value = site.url;
    
    // Set category dropdown
    const categorySelect = document.getElementById('editSiteCategory');
    if (categorySelect) {
        categorySelect.value = categories[categoryIndex].id;
    }
    
    modal.style.display = 'flex';
    document.getElementById('editSiteName').focus();
}

function closeEditSiteModal() {
    const modal = document.getElementById('editSiteModal');
    modal.style.display = 'none';
    document.getElementById('editSiteName').value = '';
    document.getElementById('editSiteUrl').value = '';
    editingCategoryIndex = null;
    editingItemIndex = null;
}

async function updateSite() {
    if (editingCategoryIndex === null || editingItemIndex === null) return;
    
    const nameInput = document.getElementById('editSiteName');
    const urlInput = document.getElementById('editSiteUrl');
    const categorySelect = document.getElementById('editSiteCategory');
    
    if (!nameInput || !urlInput) return;
    
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const newCategoryId = categorySelect ? categorySelect.value : categories[editingCategoryIndex].id;
    
    // Validate input length
    if (!name || name.length > 50) {
        alert('Please enter a valid site name (1-50 characters)');
        return;
    }
    
    if (!url || url.length > 500) {
        alert('Please enter a valid URL (max 500 characters)');
        return;
    }
    
    // Add https:// if not present
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
    }
    
    // Validate URL
    try {
        new URL(fullUrl);
    } catch (e) {
        alert('Please enter a valid URL');
        return;
    }
    
    // Extract clean root domain (abc.com only)
    const domain = getRootDomain(fullUrl);
    
    // Show loading state
    const submitBtn = document.querySelector('#editSiteModal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;
    
    // Always fetch fresh favicon to ensure icon matches the domain
    const faviconUrl = await fetchActualFavicon(fullUrl, domain);
    
    const updatedSite = {
        name: name,
        url: fullUrl,
        domain: domain,
        customIcon: faviconUrl
    };
    
    // Check if category changed
    const oldCategoryId = categories[editingCategoryIndex].id;
    const affectedCategories = [editingCategoryIndex];
    
    if (newCategoryId !== oldCategoryId) {
        // Move to different category
        categories[editingCategoryIndex].websites.splice(editingItemIndex, 1);
        const newCategory = categories.find(cat => cat.id === newCategoryId);
        if (newCategory) {
            newCategory.websites.push(updatedSite);
            const newCategoryIndex = categories.indexOf(newCategory);
            affectedCategories.push(newCategoryIndex);
        }
    } else {
        // Update in same category
        categories[editingCategoryIndex].websites[editingItemIndex] = updatedSite;
    }
    
    saveCategories();
    
    // Only update affected grids
    affectedCategories.forEach(catIndex => updateCategoryGrid(catIndex));
    
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    closeEditSiteModal();
}

// Add site modal
function showAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.style.display = 'flex';
    document.getElementById('siteName').focus();
}

function closeAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.style.display = 'none';
    document.getElementById('siteName').value = '';
    document.getElementById('siteUrl').value = '';
}

async function addNewSite() {
    const nameInput = document.getElementById('siteName');
    const urlInput = document.getElementById('siteUrl');
    const categorySelect = document.getElementById('siteCategory');
    
    if (!nameInput || !urlInput) return;
    
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const categoryId = categorySelect ? categorySelect.value : categories[0].id; // Default to first category
    
    // Validate input length
    if (!name || name.length > 50) {
        alert('Please enter a valid site name (1-50 characters)');
        return;
    }
    
    if (!url || url.length > 500) {
        alert('Please enter a valid URL (max 500 characters)');
        return;
    }
    
    // Add https:// if not present
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
    }
    
    // Validate URL
    try {
        new URL(fullUrl);
    } catch (e) {
        alert('Please enter a valid URL');
        return;
    }
    
    // Extract clean root domain (abc.com only)
    const domain = getRootDomain(fullUrl);
    
    // Show loading state
    const submitBtn = document.querySelector('#addSiteModal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;
    
    // Try to fetch the actual favicon
    const faviconUrl = await fetchActualFavicon(fullUrl, domain);
    
    // Find target category and add site
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        category.websites.push({
            name: name,
            url: fullUrl,
            domain: domain,
            customIcon: faviconUrl
        });
        
        saveCategories();
        
        // Only update the affected category grid
        const categoryIndex = categories.indexOf(category);
        updateCategoryGrid(categoryIndex);
    }
    
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    closeAddSiteModal();
}

// Fetch actual favicon from website

// Fetch actual favicon from website
async function fetchActualFavicon(url, domain) {
    try {
        const origin = new URL(url).origin;
        // Domain is already cleaned by getRootDomain (e.g., abc.com)
        
        // Try multiple high-quality favicon sources in order of preference
        const faviconSources = [
            // Google's favicon service - most reliable and works for almost all sites
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
            // Clearbit Logo API - high quality logos for popular sites
            `https://logo.clearbit.com/${domain}`,
            // Direct site favicons - highest quality when available
            `${origin}/favicon.ico`,
            `${origin}/favicon.png`,
            `${origin}/apple-touch-icon.png`,
            `${origin}/apple-touch-icon-precomposed.png`,
            // DuckDuckGo's favicon service
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            // Favicon Kit API
            `https://api.faviconkit.com/${domain}/128`
        ];
        
        // Try to load each source with a simple image test
        for (const source of faviconSources) {
            try {
                // Create a test image to check if the favicon loads
                const testLoad = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(true);
                    img.onerror = () => reject(false);
                    img.src = source;
                    // Timeout after 3 seconds
                    setTimeout(() => reject(false), 3000);
                });
                
                if (testLoad) {
                    return source;
                }
            } catch (e) {
                continue;
            }
        }
        
        // Ultimate fallback to Google's favicon service
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
        // Ultimate fallback
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    }
}

// Section management modal
function openSectionModal(mode = 'add', categoryIndex = null) {
    sectionModalMode = mode;
    editingSectionIndex = categoryIndex;
    const modal = elements.sectionModal || document.getElementById('sectionModal');
    const title = document.getElementById('sectionModalTitle');
    const submitBtn = modal.querySelector('.btn-primary');
    const nameInput = elements.sectionNameInput || document.getElementById('sectionName');
    const iconInput = elements.sectionIconInput || document.getElementById('sectionIcon');
    
    if (mode === 'edit' && categoryIndex !== null && categories[categoryIndex]) {
        const category = categories[categoryIndex];
        nameInput.value = getCategoryDisplayName(category) || category.name || '';
        iconInput.value = (category.icon || '').trim();
        title.textContent = 'Edit Section';
        submitBtn.textContent = 'Save Changes';
    } else {
        nameInput.value = '';
        iconInput.value = '';
        title.textContent = 'Add Section';
        submitBtn.textContent = 'Add Section';
        editingSectionIndex = null;
    }
    
    modal.style.display = 'flex';
    nameInput.focus();
}

function closeSectionModal() {
    const modal = elements.sectionModal || document.getElementById('sectionModal');
    if (!modal) return;
    modal.style.display = 'none';
    const nameInput = elements.sectionNameInput || document.getElementById('sectionName');
    const iconInput = elements.sectionIconInput || document.getElementById('sectionIcon');
    if (nameInput) nameInput.value = '';
    if (iconInput) iconInput.value = '';
    sectionModalMode = 'add';
    editingSectionIndex = null;
}

function handleSectionSubmit(e) {
    e.preventDefault();
    const nameInput = elements.sectionNameInput || document.getElementById('sectionName');
    const iconInput = elements.sectionIconInput || document.getElementById('sectionIcon');
    if (!nameInput) return;
    const rawName = nameInput.value.trim();
    const rawIcon = iconInput ? iconInput.value.trim() : '';
    if (!rawName) {
        alert('Please enter a section name');
        return;
    }
    let iconValue = rawIcon || rawName.charAt(0).toUpperCase() || '📁';
    iconValue = iconValue.substring(0, 2); // prevent long strings
    
    if (sectionModalMode === 'edit' && editingSectionIndex !== null && categories[editingSectionIndex]) {
        categories[editingSectionIndex].name = rawName;
        categories[editingSectionIndex].icon = iconValue;
    } else {
        const newCategory = {
            id: generateCategoryId(rawName),
            name: rawName,
            icon: iconValue,
            websites: []
        };
        categories.push(newCategory);
    }
    
    saveCategories();
    populateCategoryDropdowns();
    renderShortcuts();
    closeSectionModal();
}

// Dark mode functionality
function setupDarkMode() {
    const darkModeToggle = elements.darkModeToggle || document.getElementById('darkModeToggle');
    const toggleIcon = elements.toggleIcon || darkModeToggle.querySelector('.toggle-icon');
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            toggleIcon.textContent = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            toggleIcon.textContent = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Check for saved dark mode preference or system preference
function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const toggleIcon = elements.toggleIcon || document.querySelector('.toggle-icon');
    
    if (savedMode === 'enabled' || (savedMode === null && prefersDark)) {
        document.body.classList.add('dark-mode');
        if (toggleIcon) toggleIcon.textContent = '☀️';
    } else {
        if (toggleIcon) toggleIcon.textContent = '🌙';
    }
}

// Search functions
function searchGoogle(event) {
    event.preventDefault();
    const query = document.getElementById('googleSearch').value.trim();
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        document.getElementById('googleSearch').value = '';
    }
    return false;
}

function searchYouTube(event) {
    event.preventDefault();
    const query = document.getElementById('youtubeSearch').value.trim();
    if (query) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
        document.getElementById('youtubeSearch').value = '';
    }
    return false;
}

function searchPerplexity(event) {
    event.preventDefault();
    const query = document.getElementById('perplexitySearch').value.trim();
    if (query) {
        window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`, '_blank');
        document.getElementById('perplexitySearch').value = '';
    }
    return false;
}

function searchX(event) {
    event.preventDefault();
    const query = document.getElementById('xSearch').value.trim();
    if (query) {
        window.open(`https://twitter.com/search?q=${encodeURIComponent(query)}`, '_blank');
        document.getElementById('xSearch').value = '';
    }
    return false;
}

function searchReddit(event) {
    event.preventDefault();
    const query = document.getElementById('redditSearch').value.trim();
    if (query) {
        window.open(`https://www.reddit.com/search/?q=${encodeURIComponent(query)}`, '_blank');
        document.getElementById('redditSearch').value = '';
    }
    return false;
}

// Debounced input handler (for performance optimization)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounced input handlers if needed for autocomplete in future
const inputs = document.querySelectorAll('.widget-input');
inputs.forEach(input => {
    input.addEventListener('input', debounce((e) => {
        // Future: Add autocomplete or suggestions here
    }, 300));
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedMode = localStorage.getItem('darkMode');
    const toggleIcon = elements.toggleIcon || document.querySelector('.toggle-icon');
    // Only auto-update if user hasn't set a preference
    if (savedMode === null && toggleIcon) {
        if (e.matches) {
            document.body.classList.add('dark-mode');
            toggleIcon.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            toggleIcon.textContent = '🌙';
        }
    }
});

// Populate category dropdowns in modals
function populateCategoryDropdowns() {
    const addCategorySelect = document.getElementById('siteCategory');
    const editCategorySelect = document.getElementById('editSiteCategory');
    
    if (addCategorySelect) {
        addCategorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = formatCategoryLabel(cat);
            addCategorySelect.appendChild(option);
        });
    }
    
    if (editCategorySelect) {
        editCategorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = formatCategoryLabel(cat);
            editCategorySelect.appendChild(option);
        });
    }
}

// ========================================
// EXPORT/IMPORT FUNCTIONALITY
// ========================================

function exportData() {
    const data = {
        categories: categories,
        categoryStates: JSON.parse(localStorage.getItem('categoryStates') || '{}'),
        darkMode: localStorage.getItem('darkMode'),
        websites: JSON.parse(localStorage.getItem('websites') || '[]'),
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `homepage-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Data exported successfully! Check your Downloads folder.', 'success');
}

function importData() {
    const fileInput = document.getElementById('importFileInput');
    fileInput.click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.categories || !Array.isArray(data.categories)) {
                throw new Error('Invalid data format: missing categories array');
            }
            
            // Confirm before overwriting
            if (!confirm('This will replace all your current data. Continue?')) {
                return;
            }
            
            // Import data
            categories = data.categories;
            saveCategories();
            
            // Restore other settings
            if (data.categoryStates) {
                localStorage.setItem('categoryStates', JSON.stringify(data.categoryStates));
            }
            if (data.darkMode) {
                localStorage.setItem('darkMode', data.darkMode);
            }
            if (data.websites) {
                localStorage.setItem('websites', JSON.stringify(data.websites));
            }
            
            // Refresh the page to show imported data
            showNotification('Data imported successfully! Refreshing...', 'success');
            setTimeout(() => {
                location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Error importing data: ' + error.message, 'error');
        }
    };
    
    reader.onerror = () => {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.getElementById('notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = 'rgba(52, 211, 153, 0.9)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'rgba(248, 113, 113, 0.9)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'rgba(102, 126, 234, 0.9)';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup modal event handlers
function setupModalHandlers() {
    // Populate category dropdowns
    populateCategoryDropdowns();
    
    if (elements.addSectionBtn) {
        elements.addSectionBtn.addEventListener('click', () => openSectionModal('add'));
    }
    const sectionForm = elements.sectionForm || document.getElementById('sectionForm');
    if (sectionForm) {
        sectionForm.addEventListener('submit', handleSectionSubmit);
    }
    const closeSectionBtn = document.getElementById('closeSectionModal');
    if (closeSectionBtn) {
        closeSectionBtn.addEventListener('click', closeSectionModal);
    }
    const cancelSectionBtn = document.getElementById('cancelSectionBtn');
    if (cancelSectionBtn) {
        cancelSectionBtn.addEventListener('click', closeSectionModal);
    }
    
    // Setup add modal handlers
    document.getElementById('closeModal').addEventListener('click', closeAddSiteModal);
    document.getElementById('cancelBtn').addEventListener('click', closeAddSiteModal);
    document.getElementById('addSiteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewSite();
    });
    
    // Setup edit modal handlers
    document.getElementById('closeEditModal').addEventListener('click', closeEditSiteModal);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditSiteModal);
    document.getElementById('editSiteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        updateSite();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const addModal = elements.addModal || document.getElementById('addSiteModal');
        const editModal = elements.editModal || document.getElementById('editSiteModal');
        const sectionModal = elements.sectionModal || document.getElementById('sectionModal');
        if (e.target === addModal) {
            closeAddSiteModal();
        }
        if (e.target === editModal) {
            closeEditSiteModal();
        }
        if (e.target === sectionModal) {
            closeSectionModal();
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize cached elements first
    initElements();
    
    // Initialize features
    initDarkMode();
    setupDarkMode();
    await loadCategories(); // Wait for Gist data to load
    renderShortcuts();
    setupModalHandlers();
    
    // Setup Export/Import buttons
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    if (importBtn) {
        importBtn.addEventListener('click', importData);
    }
    if (importFileInput) {
        importFileInput.addEventListener('change', handleImportFile);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const darkModeToggle = elements.darkModeToggle || document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.click();
    }
    
    // Focus first search input on '/' key
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const googleSearch = document.getElementById('googleSearch');
        if (googleSearch) googleSearch.focus();
    }
    
    // ESC to close modal
    if (e.key === 'Escape') {
        const addModal = elements.addModal || document.getElementById('addSiteModal');
        const editModal = elements.editModal || document.getElementById('editSiteModal');
        const sectionModal = elements.sectionModal || document.getElementById('sectionModal');
        if (addModal && addModal.style.display === 'flex') {
            closeAddSiteModal();
        }
        if (editModal && editModal.style.display === 'flex') {
            closeEditSiteModal();
        }
        if (sectionModal && sectionModal.style.display === 'flex') {
            closeSectionModal();
        }
    }
});
