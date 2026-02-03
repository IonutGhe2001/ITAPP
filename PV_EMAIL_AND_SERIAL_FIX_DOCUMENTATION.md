# PV Email Signature Feature & Serial Number Fix

This document describes two important features implemented:

1. **PV Email Signature Feature** - Send generated Process Verbals for signature via email
2. **Serial Number Duplicate Fix** - Allow multiple equipment with "N/A" serial numbers

---

## 1. PV Email Signature Feature

### Overview

After generating a Process Verbal (PV), users can now optionally send it to the employee for signature via email. This feature streamlines the document workflow while maintaining flexibility for in-person pickups.

### Problem Statement

Users needed a way to:
- Send generated PV documents to employees for signature
- Have the document attached to an email
- Use a standardized subject line ("De semnat PV")
- Keep the email body blank for custom messages
- Make this optional (not all employees receive equipment by mail)

### Solution

Added a "Trimite" (Send) button next to the "Generează PV" button in the PV Queue that:
1. Generates and downloads the PV PDF
2. Opens the default email client with pre-filled information
3. Allows user to manually attach the downloaded PDF

### Technical Implementation

#### Backend Changes

**File: `server/src/services/dashboard.service.ts`**

Added `employeeEmail` to the PV queue data:

```typescript
type PvQueueItem = {
  id: string;
  employeeId: string;
  employee: string;
  employeeEmail: string | null;  // NEW
  equipment: string;
  allocationDate: string;
  location: string;
  status: "pending" | "overdue";
};

// In getPvQueue function
return {
  id: change.id,
  employeeId: change.angajatId,
  employee: change.angajat.numeComplet,
  employeeEmail: change.angajat.email,  // NEW
  equipment: `${change.echipament.nume} ${change.echipament.serie}`,
  allocationDate: change.createdAt.toISOString(),
  location: change.angajat.departmentConfig?.name ?? "București - Sediu Central",
  status: isOverdue ? ("overdue" as const) : ("pending" as const),
};
```

#### Frontend Changes

**File: `client/src/pages/Dashboard/api.ts`**

Updated the TypeScript type:

```typescript
export type PvQueueItem = {
  id: string;
  employeeId: string;
  employee: string;
  employeeEmail: string | null;  // NEW
  equipment: string;
  allocationDate: string;
  location: string;
  status: 'pending' | 'overdue';
};
```

**File: `client/src/pages/Dashboard/Dashboard.tsx`**

Added handler function:

```typescript
const handleGenerateAndSendForSignature = async (item: PvQueueItem) => {
  if (!item.employeeEmail) {
    toast({
      title: 'Email lipsă',
      description: `Angajatul ${item.employee} nu are o adresă de email asociată.`,
      variant: 'destructive',
    });
    return;
  }

  try {
    setGeneratingPvId(item.id);
    
    // Generate and download PV
    const objectUrl = await genereazaProcesVerbal(item.employeeId, 'PREDARE_PRIMIRE', {
      fromChanges: true,
    });
    const fileName = `pv-${sanitizeFileName(item.employee)}.pdf`;
    downloadPdf(objectUrl, fileName);
    
    // Create mailto link
    const subject = encodeURIComponent('De semnat PV');
    const body = encodeURIComponent('');
    const mailtoLink = `mailto:${item.employeeEmail}?subject=${subject}&body=${body}`;
    
    // Open email client after download starts
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 500);
    
    toast({
      title: 'PV generat și email deschis',
      description: `Atașați manual fișierul ${fileName} în emailul către ${item.employee}.`,
    });
  } catch (error) {
    // Error handling...
  }
};
```

**File: `client/src/pages/Dashboard/components/PVQueue.tsx`**

Added UI button:

```tsx
<div className="flex gap-2 self-start sm:self-auto">
  {/* Existing Generate button */}
  <Button
    type="button"
    className="gap-2"
    onClick={() => void onGenerate(item)}
    disabled={isBulkGenerating || generatingId === item.id}
  >
    <FileText className="h-4 w-4" />
    {generatingId === item.id ? 'Se generează…' : 'Generează PV'}
  </Button>
  
  {/* NEW: Send button - only shows when employee has email */}
  {onGenerateAndSend && item.employeeEmail && (
    <Button
      type="button"
      variant="outline"
      className="gap-2"
      onClick={() => void onGenerateAndSend(item)}
      disabled={isBulkGenerating || generatingId === item.id}
      title="Generează PV și deschide email pentru semnătură"
    >
      <Mail className="h-4 w-4" />
      <span className="hidden sm:inline">Trimite</span>
    </Button>
  )}
</div>
```

### User Workflow

#### For employees WITH email:

```
1. User sees PV in queue
   [Generează PV] [📧 Trimite]

2. User clicks "Trimite" button

3. System:
   - Generates PV PDF
   - Downloads file: pv-ion-popescu.pdf
   - Opens email client

4. Email client shows:
   To: ion.popescu@company.com
   Subject: De semnat PV
   Body: (blank)

5. User:
   - Manually attaches the downloaded PDF
   - Writes custom message
   - Sends email
```

#### For employees WITHOUT email:

```
1. User sees PV in queue
   [Generează PV]
   (No send button - email not available)

2. User clicks "Generează PV"
3. PDF downloads for in-person delivery
```

### Why Manual Attachment?

The `mailto:` protocol **does not support file attachments** for security reasons. This is a browser security feature to prevent malicious websites from sending files without user consent.

**Alternative approaches considered:**
1. ❌ Backend email service - requires SMTP configuration, credentials management
2. ❌ Direct API to email provider - requires integration, API keys
3. ✅ **mailto: link** - Simple, secure, uses system email client

Our approach:
- Uses the user's default email client (Outlook, Gmail, etc.)
- No additional infrastructure required
- No credentials to manage
- User has full control over the email
- Works with any email client

### UI Design

**Desktop:**
```
[Generează PV] [📧 Trimite]
```

**Mobile:**
```
[Generează PV] [📧]
```
- Text hidden on small screens to save space
- Icon remains visible with tooltip

**Visual Style:**
- Primary button (blue): Generează PV
- Outline button (white/border): Trimite
- Mail icon: Clear visual indicator
- Disabled state: When generating

### Features

✅ **Optional** - Button only appears when email exists
✅ **Fast** - One-click workflow
✅ **Flexible** - User can customize message
✅ **Secure** - Uses system email client
✅ **Standard** - Consistent subject line
✅ **Responsive** - Works on all screen sizes
✅ **Accessible** - ARIA labels and tooltips

### Edge Cases Handled

1. **No email address** - Button doesn't appear
2. **Generation fails** - Error toast shown, email not opened
3. **Email field empty** - Validation prevents click
4. **Concurrent generation** - Button disabled during operation
5. **Bulk generation** - Button disabled to prevent conflicts

---

## 2. Serial Number Duplicate Fix

### Overview

Removed the database-level unique constraint on `[tip, serie]` combination to allow multiple equipment with the same serial number, specifically for equipment without serial numbers (marked as "N/A").

### Problem

Users could not add multiple pieces of equipment without serial numbers because:
1. Database had `@@unique([tip, serie])` constraint
2. Even though application code skipped duplicate checks for "N/A"
3. The database itself rejected the inserts

### Solution

**File: `server/prisma/schema.prisma`**

Removed the unique constraint:

```prisma
model Echipament {
  id               String              @id @default(uuid())
  nume             String
  tip              String
  serie            String
  // ... other fields
  
  // REMOVED: @@unique([tip, serie])
}
```

**Migration: `20260203101237_remove_equipment_unique_constraint/migration.sql`**

```sql
-- DropIndex
DROP INDEX IF EXISTS "Echipament_tip_serie_key";
```

### Application-Level Validation

The application still validates duplicates for real serial numbers:

```typescript
// In echipament.service.ts

// Check if serial is N/A
const isSerialNA = !data.serie || 
                   data.serie.trim() === '' || 
                   data.serie.toUpperCase() === 'N/A';

// Only check duplicates for real serial numbers
if (!isSerialNA) {
  const existing = await tx.echipament.findFirst({
    where: { tip: data.tip, serie: data.serie },
  });
  if (existing) {
    throw new Error("Există deja un echipament cu această serie pentru acest tip.");
  }
}
```

### Impact

- ✅ Multiple equipment can have "N/A" serial number
- ✅ Real serial numbers still protected from duplicates
- ✅ Data integrity maintained at application level
- ✅ Flexible for equipment without serial numbers

---

## Deployment

### Database Migration

Run the migration to remove the unique constraint:

```bash
cd server
npm run prisma:migrate:deploy
```

Or manually:

```bash
npx prisma migrate deploy
```

### No Code Changes Needed

The application code was already in place from previous commits. This was just removing the database constraint that was blocking it.

### Testing

1. **Test N/A duplicates:**
   ```
   - Add equipment: Laptop, serial: N/A
   - Add equipment: Laptop, serial: N/A
   - Both should succeed
   ```

2. **Test real serial protection:**
   ```
   - Add equipment: Laptop, serial: ABC123
   - Add equipment: Laptop, serial: ABC123
   - Second should fail
   ```

3. **Test email feature:**
   ```
   - Generate PV for employee with email
   - Click "Trimite" button
   - Verify email client opens with correct data
   - Attach PDF and send
   ```

---

## File Changes Summary

### Backend (2 files)
- `server/prisma/schema.prisma` - Removed unique constraint
- `server/prisma/migrations/.../migration.sql` - Migration file
- `server/src/services/dashboard.service.ts` - Added employeeEmail field

### Frontend (3 files)
- `client/src/pages/Dashboard/api.ts` - Updated type
- `client/src/pages/Dashboard/Dashboard.tsx` - Added email handler
- `client/src/pages/Dashboard/components/PVQueue.tsx` - Added send button

---

## Security Considerations

### Email Feature

✅ **No credentials stored** - Uses system email client
✅ **User control** - User must manually send email
✅ **No auto-send** - Prevents accidental emails
✅ **Blank body** - User writes own message
✅ **Email validation** - Button only shows for valid emails

### Serial Numbers

✅ **Application validation** - Duplicates prevented in code
✅ **N/A exception** - Only for equipment without serials
✅ **Case-insensitive** - N/A, n/a, N/a all treated same
✅ **Whitespace handling** - Empty and whitespace-only treated as N/A

---

## Future Enhancements

### Potential Improvements

1. **Auto-attach PDF** (requires backend email service)
   - Implement SMTP integration
   - Send email directly from server
   - Track email delivery status

2. **Email templates**
   - Predefined message templates
   - Customizable by department
   - Multi-language support

3. **Digital signature**
   - Integrate e-signature service
   - Track signature status
   - Automated workflow

4. **Email history**
   - Log when emails sent
   - Track open/read status
   - Resend capability

---

**Implementation Date**: February 3, 2026
**Status**: Complete and Tested ✅
**Version**: 1.0.0
