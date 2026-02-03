# Additional Fixes - Serial Number Exception, Archive Filters, and Header

## Summary of Changes

This document describes the fixes implemented to address four specific issues:

1. Serial number exception for equipment without serial numbers (N/A)
2. Removed document type filter from archive page
3. Show only active years in archive year filter
4. Added archive page name to header

---

## 1. Serial Number Exception for N/A Equipment

### Problem
The equipment validation was preventing the creation of multiple equipment items with "N/A" serial numbers. This was problematic because:
- Some equipment types don't have serial numbers
- Users were setting serial numbers to "N/A" when equipment lacks a serial
- The duplicate validation was incorrectly treating all "N/A" values as duplicates

### Solution
Modified the serial number validation logic to skip duplicate checks when:
- Serial number is "N/A" (case-insensitive)
- Serial number is empty string
- Serial number is null

### Implementation

**File: `server/src/services/echipament.service.ts`**

#### In `validateEchipamentUpdate()`:
```typescript
const isSerialNA = !newSerie || newSerie.trim() === '' || newSerie.toUpperCase() === 'N/A';

if ((newTip !== current.tip || newSerie !== current.serie) && !isSerialNA) {
  // Only check for duplicates if serial is NOT N/A
  const duplicate = await tx.echipament.findFirst({
    where: { tip: newTip, serie: newSerie, NOT: { id } },
  });
  if (duplicate) {
    throw error; // Duplicate found
  }
}
```

#### In `createEchipament()`:
```typescript
const isSerialNA = !data.serie || data.serie.trim() === '' || data.serie.toUpperCase() === 'N/A';

if (!isSerialNA) {
  // Only check for duplicates if serial is NOT N/A
  const existing = await tx.echipament.findFirst({
    where: { tip: data.tip, serie: data.serie },
  });
  if (existing) {
    throw error; // Duplicate found
  }
}
```

### Benefits
- ✅ Can now add multiple equipment without serial numbers
- ✅ Maintains duplicate protection for equipment with actual serial numbers
- ✅ Works with checkbox "Skip Serial Number" feature from equipment form

---

## 2. Removed Document Type Filter from Archive Page

### Problem
The archive page had a document type filter dropdown that was not needed because:
- The app primarily uses Process Verbals (PV)
- Document type is already displayed in results
- Extra filter cluttered the UI

### Solution
Removed the document type filter from the archive page UI while keeping:
- Employee name filter
- Year filter
- Status filter (active/inactive employees)

### Implementation

**File: `client/src/pages/Archive/Archive.tsx`**

**Before:**
```typescript
// State
const [documentType, setDocumentType] = useState('ALL');

// Query
documentType: documentType === 'ALL' ? undefined : documentType,

// UI - 4 column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Input employeeName />
  <Select documentType />  // ← Removed
  <Select uploadYear />
  <Select includeInactive />
</div>
```

**After:**
```typescript
// No documentType state

// Query - no documentType parameter

// UI - 3 column grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Input employeeName />
  <Select uploadYear />
  <Select includeInactive />
</div>
```

### Benefits
- ✅ Cleaner, simpler UI
- ✅ Faster filtering (one less parameter)
- ✅ Better responsive layout with 3 columns

---

## 3. Show Only Active Years in Archive Filter

### Problem
The year dropdown showed the last 15 years statically, including years with no documents:
```typescript
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear - i);
// [2026, 2025, 2024, ..., 2012] - all years regardless of data
```

### Solution
Created a backend API to fetch only years that have actual documents, then display those dynamically.

### Implementation

#### Backend

**File: `server/src/services/angajatDocument.service.ts`**
```typescript
export const getAvailableYears = async (): Promise<number[]> => {
  const documents = await prisma.angajatDocument.findMany({
    select: { uploadYear: true },
    distinct: ['uploadYear'],
    orderBy: { uploadYear: 'desc' },
  });
  
  return documents
    .map(doc => doc.uploadYear)
    .filter((year): year is number => year !== null && year !== undefined);
};
```

**File: `server/src/controllers/angajatDocumentController.ts`**
```typescript
export const getAvailableDocumentYears = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const years = await getAvailableYears();
    res.json(years);
  } catch (err) {
    next(err);
  }
};
```

**File: `server/src/routes/angajati.ts`**
```typescript
router.get("/archive/years", authorizeRoles("admin"), docController.getAvailableDocumentYears);
```

#### Frontend

**File: `client/src/features/employees/angajatiService.ts`**
```typescript
export const useAvailableDocumentYears = () =>
  useQuery<number[]>({
    queryKey: ['available-document-years'],
    queryFn: async () => {
      const response = await http.get('/angajati/archive/years');
      return response as number[];
    },
  });
```

**File: `client/src/pages/Archive/Archive.tsx`**
```typescript
// Fetch available years dynamically
const { data: availableYears, isLoading: yearsLoading } = useAvailableDocumentYears();

// Display in dropdown
<SelectContent>
  <SelectItem value="ALL">Toți anii</SelectItem>
  {yearsLoading ? (
    <SelectItem value="loading" disabled>Se încarcă...</SelectItem>
  ) : (
    availableYears?.map((year) => (
      <SelectItem key={year} value={year.toString()}>
        {year}
      </SelectItem>
    ))
  )}
</SelectContent>
```

### Benefits
- ✅ Dropdown shows only years with actual documents
- ✅ No confusion from empty years
- ✅ Dynamic - updates as documents are added
- ✅ Better UX with loading state

---

## 4. Added Archive Page Name to Header

### Problem
The header didn't display the page name for the archive page, showing only "Pagina" as default.

### Solution
Added the archive route to the `pageTitles` constant.

### Implementation

**File: `client/src/constants/pageTitles.ts`**

**Before:**
```typescript
const pageTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.EQUIPMENT]: 'Echipamente',
  [ROUTES.COLEGI]: 'Colegi',
  [ROUTES.PROFILE]: 'Profil',
  [ROUTES.SEARCH]: 'Căutare',
  // Archive missing
};
```

**After:**
```typescript
const pageTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.EQUIPMENT]: 'Echipamente',
  [ROUTES.COLEGI]: 'Colegi',
  [ROUTES.PROFILE]: 'Profil',
  [ROUTES.SEARCH]: 'Căutare',
  [ROUTES.ARCHIVE]: 'Arhivă',  // ← Added
};
```

The header component (`client/src/layouts/components/Header.tsx`) already had the logic to use this:
```typescript
const title = equipmentId
  ? `INFO: ${equipment?.nume ?? equipmentId}`
  : pageTitles[location.pathname] || 'Pagina';
```

### Benefits
- ✅ Header now displays "Arhivă" on archive page
- ✅ Consistent with other pages
- ✅ Better user experience

---

## Testing Checklist

### Serial Number Exception
- [x] Create equipment with N/A serial number
- [x] Create multiple equipment with N/A serial numbers
- [x] Verify duplicate check still works for real serial numbers
- [x] Test with checkbox "Skip Serial Number" feature

### Archive Page Filters
- [x] Document type filter removed from UI
- [x] Only 3 filters displayed (name, year, status)
- [x] Year dropdown shows only active years
- [x] Loading state displays while fetching years
- [x] Search still works correctly

### Page Header
- [x] Navigate to archive page
- [x] Verify header shows "Arhivă"

---

## Technical Details

### API Endpoints

**New Endpoint:**
```
GET /api/angajati/archive/years
Authorization: Required (Admin only)
Response: number[]
Example: [2026, 2025, 2024, 2023]
```

### Database Queries

**Get Available Years:**
```sql
SELECT DISTINCT "uploadYear" 
FROM "AngajatDocument" 
ORDER BY "uploadYear" DESC;
```

**Check Serial Duplicate (Before Fix):**
```sql
SELECT * FROM "Echipament" 
WHERE "tip" = ? AND "serie" = ?;
-- Would fail for multiple N/A entries
```

**Check Serial Duplicate (After Fix):**
```typescript
if (!isSerialNA) {
  // Only query if serie is not N/A
  SELECT * FROM "Echipament" 
  WHERE "tip" = ? AND "serie" = ?;
}
-- Skips query for N/A entries
```

---

## Files Modified

### Backend (4 files)
1. `server/src/services/echipament.service.ts` - Serial number validation
2. `server/src/services/angajatDocument.service.ts` - Get available years
3. `server/src/controllers/angajatDocumentController.ts` - Years endpoint controller
4. `server/src/routes/angajati.ts` - Years route

### Frontend (3 files)
1. `client/src/pages/Archive/Archive.tsx` - UI changes (removed filter, dynamic years)
2. `client/src/features/employees/angajatiService.ts` - API hook for years
3. `client/src/constants/pageTitles.ts` - Archive page title

---

## Deployment Notes

- No database migrations required
- Backward compatible
- No breaking changes
- Frontend and backend can be deployed independently

---

**Implementation Date**: February 2026
**Status**: Complete ✅
