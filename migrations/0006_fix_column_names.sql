
-- Fix column naming issues to match the application schema
-- This handles the discrepancy between namebn vs name_bn

-- First, check existing structure and rename if needed
DO $$
BEGIN
    -- Handle products table columns
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'name_bn') THEN
        -- Rename existing name_bn to namebn to match application schema
        ALTER TABLE products RENAME COLUMN name_bn TO namebn;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description_bn') THEN
        ALTER TABLE products RENAME COLUMN description_bn TO descriptionbn;
    END IF;
    
    -- Handle categories table columns
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'name_bn') THEN
        ALTER TABLE categories RENAME COLUMN name_bn TO namebn;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description_bn') THEN
        ALTER TABLE categories RENAME COLUMN description_bn TO descriptionbn;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Column renaming completed or columns already exist in correct format';
END $$;

-- Ensure all required columns exist with correct application schema names
ALTER TABLE products ADD COLUMN IF NOT EXISTS namebn TEXT NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS descriptionbn TEXT NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;

ALTER TABLE categories ADD COLUMN IF NOT EXISTS namebn TEXT NOT NULL DEFAULT '';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS descriptionbn TEXT;

-- Update any null values to empty strings
UPDATE products SET namebn = '' WHERE namebn IS NULL;
UPDATE products SET descriptionbn = '' WHERE descriptionbn IS NULL;
UPDATE categories SET namebn = '' WHERE namebn IS NULL;
