const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../config/db');
const Medicine = require('../models/Medicine');

// Connect to database
connectDB();

const importMedicines = async () => {
  try {
    console.log('Starting medicine import process...');
    
    // Read the JSON file
    const jsonPath = path.join(__dirname, '../../Medollo/public/unique_products.json');
    console.log('Reading file from:', jsonPath);
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const medicines = JSON.parse(rawData);
    
    console.log(`Found ${medicines.length} medicines in the JSON file`);
    
    // Clear existing medicines (optional - remove if you want to keep existing data)
    console.log('Clearing existing medicines...');
    await Medicine.deleteMany({});
    
    // Process and save medicines in batches
    const batchSize = 1000;
    let savedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < medicines.length; i += batchSize) {
      const batch = medicines.slice(i, i + batchSize);
      
      try {
        // Process each medicine in the batch
        const processedBatch = batch.map(medicine => {
          // Generate category based on composition or molecules
          let category = 'General';
          if (medicine.compositionName) {
            const composition = medicine.compositionName.toLowerCase();
            if (composition.includes('paracetamol') || composition.includes('acetaminophen')) {
              category = 'Pain Relief';
            } else if (composition.includes('vitamin') || composition.includes('calcium')) {
              category = 'Vitamins & Supplements';
            } else if (composition.includes('antibiotic') || composition.includes('amoxicillin')) {
              category = 'Antibiotics';
            } else if (composition.includes('diabetes') || composition.includes('metformin')) {
              category = 'Diabetes Care';
            } else if (composition.includes('heart') || composition.includes('cardiac')) {
              category = 'Heart Care';
            } else if (composition.includes('cough') || composition.includes('cold')) {
              category = 'Cold & Cough';
            } else if (composition.includes('stomach') || composition.includes('digestive')) {
              category = 'Digestive Health';
            }
          }
          
          // Generate tags based on composition and molecules
          const tags = [];
          if (medicine.compositionName) {
            const molecules = medicine.compositionName.split('+').map(mol => mol.trim());
            tags.push(...molecules);
          }
          if (medicine.molecules) {
            const moleculeTags = medicine.molecules.split('-').map(mol => mol.trim());
            tags.push(...moleculeTags);
          }
          
          return {
            productId: medicine.productId,
            productName: medicine.productName,
            brand: medicine.brand,
            manufacturer: medicine.manufacturer,
            compositionName: medicine.compositionName,
            molecules: medicine.molecules,
            mrp: medicine.mrp,
            packSize: medicine.packSize,
            displayPrice: medicine.displayPrice,
            isSellable: medicine.isSellable,
            isPrescriptionRequired: medicine.isPrescriptionRequired,
            auditForm: medicine.auditForm,
            productFormName: medicine.productFormName,
            switchProductIds: medicine.switchProductIds,
            packaging: medicine.packaging,
            saleUnit: medicine.saleUnit,
            countryOfOrigin: medicine.countryOfOrigin,
            imageUrl: medicine.imageUrl,
            productLongDescription: medicine.productLongDescription,
            rating: medicine.rating,
            category: category,
            tags: [...new Set(tags)], // Remove duplicates
            stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
            isActive: medicine.isSellable === 'Y'
          };
        });
        
        // Insert batch
        await Medicine.insertMany(processedBatch, { ordered: false });
        savedCount += processedBatch.length;
        
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(medicines.length / batchSize)} - Saved ${savedCount} medicines so far`);
        
      } catch (batchError) {
        console.error(`Error processing batch starting at index ${i}:`, batchError.message);
        errorCount += batch.length;
      }
    }
    
    console.log('\n=== Import Summary ===');
    console.log(`Total medicines processed: ${medicines.length}`);
    console.log(`Successfully saved: ${savedCount}`);
    console.log(`Errors: ${errorCount}`);
    
    // Create some sample categories for better organization
    console.log('\nCreating category indexes...');
    await Medicine.createIndexes();
    
    console.log('Medicine import completed successfully!');
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the import
importMedicines();
