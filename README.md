# Product Catalog Management (React + Redux Toolkit)

Product catalog management system built using React, Redux Toolkit, and Material UI.  
The app supports product creation, editing, deletion, search, filtering, sorting, pagination, and localStorage persistence.

## How to Run Locally

1. Clone the project:
   git clone : https://github.com/avm2/Product_Catalog_Manager.git

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

4. Build for production:
   npm run build


## Features Implemented
- Add, Edit, Delete, and Bulk Delete products  
- Auto-calculated discounted price  
- Search by name or description (case-insensitive)  
- Category filter  
- Sorting by date and price  
- Pagination with selectable page size  
- URL-synced filters (search, sort, page, limit)  
- LocalStorage persistence  
- Page totals for cost, sell, and final prices  
- Material UI-based UI and form validation  

## Assumptions
- No backend is used; all data is stored in localStorage  
- Product IDs are generated using UUID  
- Expiry date must not be in the past  
- Discount must be between 0% and 90%  
- All filtering and sorting is done on the client side  

## Known Limitations
- Clearing browser storage removes all saved products  
- Not suitable for large datasets (client-side filtering)  
- BrowserRouter requires rewrite rules on static hosting; HashRouter recommended  
- Search is substring-based, not full fuzzy search  

### Netlify
Demo Link: https://product-catalog-manager-omega.vercel.app/

### Vercel
- Build: `npm run build`
- Output: `build/`
- Add a `vercel.json` rewrite for SPA routing if using BrowserRouter

