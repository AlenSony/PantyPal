// Make removeItem function globally accessible
window.removeItem = function(id) {
    items = items.filter(item => item.id !== id);
    updateList();
    saveToLocalStorage();
};

document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('itemInput');
    const addButton = document.getElementById('addButton');
    const groceryList = document.getElementById('groceryList');
    const totalItems = document.getElementById('totalItems');
    const downloadButton = document.getElementById('downloadButton');
    const clearButton = document.getElementById('clearButton');
    const categorySelect = document.getElementById('categorySelect');
    const categoryCount = document.getElementById('categoryCount');

    // Load items from localStorage
    let items = JSON.parse(localStorage.getItem('groceryItems')) || [];
    updateList();

    // Add item when button is clicked
    addButton.addEventListener('click', addItem);

    // Add item when Enter key is pressed
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    // Clear all items
    clearButton.addEventListener('click', () => {
        if (items.length > 0 && confirm('Are you sure you want to clear all items?')) {
            items = [];
            updateList();
            saveToLocalStorage();
        }
    });

    // Download list as text file
    downloadButton.addEventListener('click', () => {
        if (items.length === 0) {
            alert('Your list is empty!');
            return;
        }

        const categories = [...new Set(items.map(item => item.category))];
        let listText = 'GROCERY LIST\n\n';
        
        categories.forEach(category => {
            listText += `${category.toUpperCase()}:\n`;
            items
                .filter(item => item.category === category)
                .forEach(item => {
                    listText += `- ${item.text}\n`;
                });
            listText += '\n';
        });

        const blob = new Blob([listText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grocery-list.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });

    function addItem() {
        const itemText = itemInput.value.trim();
        const category = categorySelect.value;
        
        if (itemText) {
            items.push({
                id: Date.now(),
                text: itemText,
                category: category
            });
            
            itemInput.value = '';
            updateList();
            saveToLocalStorage();
        }
    }

    function removeItem(id) {
        items = items.filter(item => item.id !== id);
        updateList();
        saveToLocalStorage();
    }

    function updateList() {
        groceryList.innerHTML = '';
        
        // Group items by category
        const categories = [...new Set(items.map(item => item.category))];
        categoryCount.textContent = categories.length;

        categories.forEach(category => {
            const categoryItems = items.filter(item => item.category === category);
            
            categoryItems.forEach(item => {
                const li = document.createElement('li');
                const itemContent = document.createElement('div');
                itemContent.className = 'item-content';
                
                const itemText = document.createElement('span');
                itemText.textContent = item.text;
                
                const categoryBadge = document.createElement('span');
                categoryBadge.className = 'item-category';
                categoryBadge.textContent = category;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.addEventListener('click', () => removeItem(item.id));
                
                itemContent.appendChild(itemText);
                itemContent.appendChild(categoryBadge);
                li.appendChild(itemContent);
                li.appendChild(deleteBtn);
                groceryList.appendChild(li);
            });
        });
        
        totalItems.textContent = items.length;
    }

    function saveToLocalStorage() {
        localStorage.setItem('groceryItems', JSON.stringify(items));
    }
}); 