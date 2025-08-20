(function() {
    'use strict';
    
    // Configuration - websites can override these
    const defaultConfig = {
        userId: '172535297', // Default to your user ID
        autoRefreshMinutes: 10,
        maxBooks: 20,
        showListView: true,
        showGridView: true,
        defaultView: 'grid' // Changed to grid default
    };
    
    // Inject CSS styles
    function injectStyles() {
        const css = `
            .goodreads-widget {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                min-height: 300px;
                font-family: inherit; /* Inherit from parent website */
            }

            .goodreads-widget .widget-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #382110;
                flex-shrink: 0;
            }

            .goodreads-widget .widget-header-left {
                display: flex;
                align-items: center;
            }

            .goodreads-widget .goodreads-logo {
                width: 20px;
                height: 20px;
                background: #382110;
                border-radius: 3px;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
            }

            .goodreads-widget .widget-title {
                font-size: 18px;
                font-weight: bold;
                color: #382110;
            }

            .goodreads-widget .view-toggle {
                display: flex;
                gap: 5px;
            }

            .goodreads-widget .toggle-btn {
                padding: 5px 10px;
                border: 1px solid #382110;
                background: white;
                color: #382110;
                border-radius: 3px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .goodreads-widget .toggle-btn:hover {
                background: #f0f0f0;
            }

            .goodreads-widget .toggle-btn.active {
                background: #382110;
                color: white;
            }

            .goodreads-widget .widget-content {
                flex: 1;
                overflow-y: auto;
                min-height: 0;
            }

            .goodreads-widget .book-item {
                display: flex;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }

            .goodreads-widget .book-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .goodreads-widget .book-cover {
                width: 60px;
                height: 90px;
                background: linear-gradient(45deg, #ddd, #ccc);
                margin-right: 15px;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #666;
                text-align: center;
                flex-shrink: 0;
            }

            .goodreads-widget .book-info {
                flex: 1;
                min-width: 0;
            }

            .goodreads-widget .book-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .goodreads-widget .book-author {
                color: #666;
                font-size: 12px;
                margin-bottom: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .goodreads-widget .book-status {
                font-size: 11px;
                color: #888;
                font-style: italic;
            }

            .goodreads-widget .grid-view {
                display: none;
                height: 100%;
            }

            .goodreads-widget .grid-view.active {
                display: block;
            }

            .goodreads-widget .list-view.active {
                display: block;
            }

            .goodreads-widget .list-view {
                display: none;
            }

            .goodreads-widget .status-section {
                margin-bottom: 25px;
            }

            .goodreads-widget .status-section:last-child {
                margin-bottom: 0;
            }

            .goodreads-widget .status-header {
                font-weight: bold;
                color: #382110;
                font-size: 16px;
                margin-bottom: 12px;
                padding-bottom: 5px;
                border-bottom: 1px solid #ddd;
            }

            .goodreads-widget .books-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 15px;
            }

            .goodreads-widget .grid-book-item {
                text-align: center;
            }

            .goodreads-widget .grid-book-cover {
                width: 100%;
                aspect-ratio: 2/3;
                max-width: 80px;
                background: linear-gradient(45deg, #ddd, #ccc);
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #666;
                margin: 0 auto 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .goodreads-widget .grid-book-title {
                font-size: 11px;
                font-weight: bold;
                color: #333;
                line-height: 1.2;
                margin-bottom: 3px;
                height: 2.4em;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .goodreads-widget .grid-book-author {
                font-size: 10px;
                color: #666;
                line-height: 1.2;
                height: 1.2em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .goodreads-widget .update-time {
                text-align: center;
                font-size: 11px;
                color: #888;
                margin-top: 15px;
                flex-shrink: 0;
            }

            .goodreads-widget .loading {
                text-align: center;
                color: #666;
                font-style: italic;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 600px) {
                .goodreads-widget .books-grid {
                    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
                    gap: 10px;
                }
            }

            @media (max-width: 400px) {
                .goodreads-widget .books-grid {
                    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                    gap: 8px;
                }
                
                .goodreads-widget .book-cover {
                    width: 50px;
                    height: 75px;
                    margin-right: 10px;
                }
                
                .goodreads-widget .widget-title {
                    font-size: 16px;
                }
                
                .goodreads-widget .toggle-btn {
                    padding: 4px 8px;
                    font-size: 11px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.textContent = css;
        document.head.appendChild(styleSheet);
    }

    // Widget functionality
    const GoodreadsWidget = {
        // CORS proxy and RSS URL
        CORS_PROXY: 'https://api.allorigins.win/raw?url=',
        
        // Parse Goodreads RSS feed
        parseGoodreadsRSS: function(xmlText, maxBooks) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            const books = [];
            items.forEach((item, index) => {
                if (index >= maxBooks) return;
                
                const title = item.querySelector('title')?.textContent || 'Unknown Title';
                const description = item.querySelector('description')?.textContent || '';
                
                // Try multiple patterns to extract author
                let author = 'Unknown Author';
                
                // Pattern 1: author: AuthorName
                let authorMatch = description.match(/author:\s*([^<\n\r]+)/i);
                if (authorMatch) {
                    author = authorMatch[1].trim();
                } else {
                    // Pattern 2: by AuthorName (common in titles)
                    authorMatch = title.match(/by\s+([^<\n\r]+)/i);
                    if (authorMatch) {
                        author = authorMatch[1].trim();
                    } else {
                        // Pattern 3: Look for author in HTML content
                        authorMatch = description.match(/>([^<]+)<\/a>\s*\(Author\)/i);
                        if (authorMatch) {
                            author = authorMatch[1].trim();
                        } else {
                            // Pattern 4: Extract from book info section
                            authorMatch = description.match(/book author:\s*([^<\n\r]+)/i);
                            if (authorMatch) {
                                author = authorMatch[1].trim();
                            }
                        }
                    }
                }
                
                // Clean up author name
                author = author.replace(/^\s*by\s+/i, '').replace(/\s*\(.*?\)\s*$/, '').trim();
                
                let status = 'Read';
                if (description.includes('currently-reading')) status = 'Currently Reading';
                if (description.includes('to-read')) status = 'Want to Read';
                
                const coverMatch = description.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
                let coverImage = null;
                if (coverMatch) {
                    coverImage = coverMatch[1];
                    coverImage = coverImage.replace(/\._SX\d+_/, '._SX98_').replace(/\._SY\d+_/, '._SY160_');
                }
                
                books.push({
                    title: this.cleanTitle(title),
                    author: author,
                    status: status,
                    cover: coverImage,
                    fallbackEmoji: this.getBookEmoji(title, author)
                });
            });
            
            return books;
        },

        cleanTitle: function(title) {
            return title.replace(/^[^:]+:\\s*/, '').trim();
        },

        getBookEmoji: function(title, author) {
            const emojis = ['📚', '📖', '📕', '📗', '📘', '📙', '📔', '🔖'];
            const hash = (title + author).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            return emojis[hash % emojis.length];
        },

        groupBooksByStatus: function(books) {
            const grouped = {
                'Currently Reading': [],
                'Want to Read': [],
                'Read': []
            };
            
            books.forEach(book => {
                if (grouped[book.status]) {
                    grouped[book.status].push(book);
                }
            });
            
            return grouped;
        },

        createGridView: function(books) {
            // Single continuous grid without sections
            return `
                <div class="books-grid">
                    ${books.map(book => `
                        <div class="grid-book-item">
                            <div class="grid-book-cover">
                                ${book.cover 
                                    ? `<img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 3px;">
                                       <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 20px;">${book.fallbackEmoji}</div>`
                                    : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">${book.fallbackEmoji}</div>`
                                }
                            </div>
                            <div class="grid-book-title">${book.title}</div>
                            <div class="grid-book-author">${book.author}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        createListView: function(books) {
            const recentBooks = books.slice(0, 8);
            return recentBooks.map(book => `
                <div class="book-item">
                    <div class="book-cover">
                        ${book.cover 
                            ? `<img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 3px;">
                               <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 24px;">${book.fallbackEmoji}</div>`
                            : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px;">${book.fallbackEmoji}</div>`
                        }
                    </div>
                    <div class="book-info">
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">by ${book.author}</div>
                        <div class="book-status">${book.status}</div>
                    </div>
                </div>
            `).join('');
        },

        createWidget: function(containerId, books, config) {
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.error('Goodreads Widget: Container not found:', containerId);
                return;
            }
            
            if (books.length === 0) {
                container.innerHTML = `
                    <div class="goodreads-widget">
                        <div class="widget-header">
                            <div class="widget-header-left">
                                <div class="goodreads-logo">G</div>
                                <div class="widget-title">On my shelf</div>
                            </div>
                        </div>
                        <div class="widget-content">
                            <div class="loading">No books found. Make sure your Goodreads profile is public!</div>
                        </div>
                    </div>
                `;
                return;
            }
            
            const groupedBooks = this.groupBooksByStatus(books);
            const showToggle = config.showListView && config.showGridView;
            
            const widgetHTML = `
                <div class="goodreads-widget">
                    <div class="widget-header">
                        <div class="widget-header-left">
                            <div class="goodreads-logo">G</div>
                            <div class="widget-title">On my shelf</div>
                        </div>
                        ${showToggle ? `
                            <div class="view-toggle">
                                <button class="toggle-btn ${config.defaultView === 'list' ? 'active' : ''}" data-view="list">List</button>
                                <button class="toggle-btn ${config.defaultView === 'grid' ? 'active' : ''}" data-view="grid">Grid</button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="widget-content">
                        <div class="list-view ${config.defaultView === 'list' || !config.showGridView ? 'active' : ''}">
                            ${this.createListView(books)}
                        </div>
                        
                        <div class="grid-view ${config.defaultView === 'grid' || !config.showListView ? 'active' : ''}">
                            ${this.createGridView(books)}
                        </div>
                    </div>
                    
                    <div class="update-time">Last updated: ${new Date().toLocaleString()}</div>
                </div>
            `;
            
            container.innerHTML = widgetHTML;
            
            // Add event listeners for view toggle
            if (showToggle) {
                const toggleBtns = container.querySelectorAll('.toggle-btn');
                const listView = container.querySelector('.list-view');
                const gridView = container.querySelector('.grid-view');
                
                toggleBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const view = btn.dataset.view;
                        
                        toggleBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        if (view === 'grid') {
                            listView.classList.remove('active');
                            gridView.classList.add('active');
                        } else {
                            gridView.classList.remove('active');
                            listView.classList.add('active');
                        }
                    });
                });
            }
        },

        loadWidget: async function(containerId, config) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Goodreads Widget: Container not found:', containerId);
                return;
            }

            container.innerHTML = '<div class="goodreads-widget"><div class="widget-content"><div class="loading">Loading your books from Goodreads...</div></div></div>';
            
            try {
                const rssUrl = `https://www.goodreads.com/review/list_rss/${config.userId}`;
                const response = await fetch(this.CORS_PROXY + encodeURIComponent(rssUrl));
                
                if (!response.ok) {
                    throw new Error('Failed to fetch RSS feed');
                }
                
                const xmlText = await response.text();
                const books = this.parseGoodreadsRSS(xmlText, config.maxBooks);
                
                this.createWidget(containerId, books, config);
                
            } catch (error) {
                console.error('Error loading Goodreads data:', error);
                container.innerHTML = `
                    <div class="goodreads-widget">
                        <div class="widget-header">
                            <div class="widget-header-left">
                                <div class="goodreads-logo">G</div>
                                <div class="widget-title">On my shelf</div>
                            </div>
                        </div>
                        <div class="widget-content">
                            <div class="loading">Error loading books. Please check that your Goodreads profile is public.</div>
                        </div>
                    </div>
                `;
            }
        }
    };

    // Public API
    window.GoodreadsWidget = {
        init: function(containerId, userConfig = {}) {
            const config = Object.assign({}, defaultConfig, userConfig);
            
            // Inject styles once
            if (!document.querySelector('style[data-goodreads-widget]')) {
                injectStyles();
                document.querySelector('style:last-of-type').setAttribute('data-goodreads-widget', 'true');
            }
            
            // Load widget
            GoodreadsWidget.loadWidget(containerId, config);
            
            // Set up auto-refresh
            if (config.autoRefreshMinutes > 0) {
                setInterval(() => {
                    GoodreadsWidget.loadWidget(containerId, config);
                }, config.autoRefreshMinutes * 60000);
            }
        }
    };

    // Auto-initialize if data attributes are found
    document.addEventListener('DOMContentLoaded', function() {
        const autoElements = document.querySelectorAll('[data-goodreads-widget]');
        autoElements.forEach(element => {
            const config = {
                userId: element.getAttribute('data-user-id') || defaultConfig.userId,
                autoRefreshMinutes: parseInt(element.getAttribute('data-auto-refresh')) || defaultConfig.autoRefreshMinutes,
                maxBooks: parseInt(element.getAttribute('data-max-books')) || defaultConfig.maxBooks,
                defaultView: element.getAttribute('data-default-view') || defaultConfig.defaultView,
                showListView: element.getAttribute('data-show-list') !== 'false',
                showGridView: element.getAttribute('data-show-grid') !== 'false'
            };
            
            window.GoodreadsWidget.init(element.id, config);
        });
    });

})();
