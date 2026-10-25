# GROCIFY — Senior Product Design & Engineering Foundation

> **Brand**: GROCIFY  
> **Parent Company**: HOW Networks  
> **Market**: India  
> **Experience**: Mobile-first, responsive editorial marketplace for curated, eco-conscious everyday goods.

---

## 1. Visual & Art Direction

GROCIFY delivers a distinctive, tactile, art-directed shopping experience, intentionally steering away from generic green templates and quick-commerce clones.

### Design Tokens Palette

| Token Name | Hex Code | Role |
| :--- | :--- | :--- |
| **Deep Forest** | `#173D2D` | Primary brand color, primary buttons, header accents |
| **Electric Citrus** | `#C8E66B` | Brand signature accent, verified eco badges, interactive focus |
| **Warm Ivory** | `#F8F6EF` | Canvas & warm paper surface base, cards |
| **Coral Pop** | `#F0A7A0` | Warm action accent, value tags, notifications |
| **Butter Yellow** | `#F5CF63` | Editorial highlights, fresh curations |
| **Soft Ink** | `#242820` | High-contrast readable typography & borders |

### Typography Foundation

- **Headings & Display**: `Space Grotesk` (self-hosted via `next/font/google`, 0 CLS, modern geometric editorial character).
- **Interface & Body**: `Inter` (neutral, legible, high-x-height body text).
- **Monospace Accents**: System monospace for batch numbers, pricing tags, and verified certificates.

---

## 2. Core Business Rules & Commercial Integrity

All commerce policies are centralized in [`frontend/src/lib/business-rules.ts`](frontend/src/lib/business-rules.ts):

1. **Strict ₹1,000 Price Ceiling**:
   - `MAX_PRODUCT_PRICE_INR = 1000`.
   - Every product price is validated against this maximum threshold.
2. **Transparent Delivery Rule**:
   - `FREE_SHIPPING_THRESHOLD_INR = 499`.
   - `STANDARD_SHIPPING_FEE_INR = 59`.
   - Orders `< ₹499` incur ₹59 del
   
   - Orders `≥ ₹499` unlock free standard delivery across all covered Indian pin codes.
   - Live shipping progress is displayed to customers without deceptive countdowns.
3. **Unconfirmed Policy Flags**:
   - Prepaid incentives (5% UPI) and COD surcharges are tracked as `UNCONFIRMED` until business approval.
4. **Verified Eco Credentials**:
   - Only validated environmental claims (e.g., Plastic-Free, NPOP Organic, Compostable) are displayed.

---

## 3. Reusable Component Foundation

Located in [`frontend/src/components/`](frontend/src/components/):

- **Buttons**: `Button.tsx` (primary, secondary, tertiary, destructive, accent, loading spinner, disabled; minimum 44px touch targets).
- **Form Controls**: `Input.tsx`, `SearchInput.tsx`, `Checkbox.tsx`, `QuantitySelector.tsx`, `Chip.tsx`.
- **Badges & Pricing**: `Badge.tsx` (eco, verified, new, value, alert), `PriceDisplay.tsx` (₹ INR formatting, true savings calculation).
- **Visuals**: `ImageContainer.tsx` (aspect-ratio preservation, smooth loaded blur-up, fallback), `Skeleton.tsx`.
- **Lifecycle Feedback**: `EmptyState.tsx`, `ErrorState.tsx`, `SuccessState.tsx`, `Toast.tsx`, `Alert.tsx`.
- **Navigation & Overlays**: `Header.tsx`, `CartIndicator.tsx`, `Breadcrumb.tsx`, `Modal.tsx`, `Drawer.tsx` (mobile bottom sheet).
- **Marketplace**: `ProductCard.tsx` (responsive grid, verified credential badge, quick add), `CategoryTile.tsx`, `CollectionHeader.tsx`, `FreeShippingProgress.tsx`.

---

## 4. Verification & Build Commands

```bash
# In frontend/
cd frontend
npm run lint    # ESLint verification (0 errors, 0 warnings)
npm run build   # Next.js production build with Turbopack

# From monorepo root:
npm run lint
npm run build
npm run dev
```

---

## 5. Next Phase: Screen 01

With the design system and engineering foundation complete and verified, the next implementation milestone is **Screen 01: Home / Discovery**.
# GROCIFY
