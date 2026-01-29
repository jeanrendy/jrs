# Dynamic Company Logos

## How It Works

The company logos in the hero section are now **automatically loaded** from the `/public/assets/companylogo` folder.

## Adding or Updating Logos

1. **Add your logo file** to: `public/assets/companylogo/`
   - Supported format: `.svg`
   - Example: `YourCompany.svg`

2. **Refresh the page** - The new logo will automatically appear!

## Technical Details

### Files Involved:
- **`src/lib/get-company-logos.ts`** - Server-side function that reads logos from the folder
- **`src/app/api/company-logos/route.ts`** - API endpoint that serves the logo list
- **`src/components/sections/hero-v2.tsx`** - Hero component that displays the logos
- **`src/app/(site)/page.tsx`** - Page that fetches and passes logos to Hero

### How It Works:
1. The API route reads all `.svg` files from `/public/assets/companylogo/`
2. It filters out placeholder files (those starting with "logocompany")
3. The page component fetches logos from the API on mount
4. Logos are passed to the Hero component as props
5. The Hero component displays them in an infinite scrolling carousel (tripled for smooth looping)

### Logo Display:
- **Light theme**: Logos appear dark/black (inverted)
- **Dark theme**: Logos appear white/light (normal)
- Grayscale by default, full color on hover
- Infinite horizontal scroll animation

## Notes
- Only `.svg` files are supported
- Files starting with "logocompany" are ignored (placeholders)
- Logo names are derived from filenames (underscores become spaces)
- No code changes needed when adding new logos!
