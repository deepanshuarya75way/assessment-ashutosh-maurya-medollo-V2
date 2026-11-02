# Medicine Import Script

This script imports medicine data from the `unique_products.json` file into the MongoDB database.

## Usage

```bash
cd server
node scripts/importMedicines.js
```

## What it does

1. Reads the `unique_products.json` file from the frontend public directory
2. Processes and categorizes medicines based on their composition
3. Generates tags and categories automatically
4. Imports medicines in batches of 1000 for better performance
5. Creates database indexes for optimal search performance

## Features

- **Automatic categorization**: Medicines are categorized based on their composition (Pain Relief, Vitamins, Antibiotics, etc.)
- **Tag generation**: Creates relevant tags from medicine molecules and composition
- **Batch processing**: Handles large datasets efficiently
- **Error handling**: Continues processing even if individual records fail
- **Progress tracking**: Shows real-time import progress

## Database Schema

The script creates a `Medicine` collection with the following key fields:
- `productId`: Unique product identifier
- `productName`: Medicine name
- `brand`: Brand name
- `manufacturer`: Manufacturer name
- `compositionName`: Chemical composition
- `mrp`: Maximum Retail Price
- `displayPrice`: Current selling price
- `category`: Auto-generated category
- `tags`: Auto-generated tags
- `stock`: Random stock quantity
- `isActive`: Whether the medicine is available

## Notes

- The script clears existing medicines before importing new ones
- Categories are generated based on medicine composition
- Stock quantities are randomly generated for demo purposes
- The script creates text indexes for efficient searching
