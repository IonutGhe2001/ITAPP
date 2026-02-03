# Visual Guide - PV Email Feature & Serial Number Fix

## Quick Reference Guide

This document provides a visual overview of the implemented features for quick reference.

---

## Feature 1: Send PV for Email Signature

### Before (Old Behavior)

```
┌─────────────────────────────────────────────────┐
│ PV Queue - În așteptare                         │
├─────────────────────────────────────────────────┤
│                                                  │
│ Ion Popescu                    [În așteptare]   │
│ Laptop Dell Latitude ABC123                     │
│ București - Sediu Central • alocat acum 2 zile  │
│                                                  │
│                          [Generează PV]          │
│                                                  │
└─────────────────────────────────────────────────┘

Problem: No way to send PV for signature via email
```

### After (New Behavior)

```
┌─────────────────────────────────────────────────┐
│ PV Queue - În așteptare                         │
├─────────────────────────────────────────────────┤
│                                                  │
│ Ion Popescu                    [În așteptare]   │
│ Laptop Dell Latitude ABC123                     │
│ București - Sediu Central • alocat acum 2 zile  │
│                                                  │
│                  [Generează PV] [📧 Trimite]     │
│                                                  │
└─────────────────────────────────────────────────┘

NEW: "Trimite" button opens email with employee address
```

### When Employee Has NO Email

```
┌─────────────────────────────────────────────────┐
│ PV Queue - În așteptare                         │
├─────────────────────────────────────────────────┤
│                                                  │
│ Maria Ionescu                  [În așteptare]   │
│ Monitor LG 27" N/A                              │
│ București - Sediu Central • alocat acum 1 zi    │
│                                                  │
│                          [Generează PV]          │
│                           (no email button)      │
│                                                  │
└─────────────────────────────────────────────────┘

Graceful: Button doesn't appear if email missing
```

---

## Workflow Diagram

### Email Signature Workflow

```
┌─────────────────┐
│ User clicks     │
│ "Trimite"       │
│ button          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ System          │
│ generates PV    │
│ PDF             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PDF downloads   │
│ to user's       │
│ computer        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Email client    │
│ opens with:     │
│ - To: employee  │
│ - Subject: PV   │
│ - Body: blank   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User manually   │
│ attaches PDF    │
│ and sends       │
└─────────────────┘
```

### Email Client Preview

```
┌──────────────────────────────────────────────────────┐
│ ✉ New Email                                     ✕    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ To:      ion.popescu@company.com                    │
│ Subject: De semnat PV                                │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │                                                   │ │
│ │ [Cursor here - user writes message]              │ │
│ │                                                   │ │
│ │                                                   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ Attachments: (none - user must attach manually)      │
│ [📎 Attach File]                                      │
│                                                       │
│                           [Send]                      │
└──────────────────────────────────────────────────────┘

User adds: pv-ion-popescu.pdf from downloads folder
```

---

## Feature 2: Serial Number Duplicate Fix

### Problem Scenario

```
┌─────────────────────────────────────────────────┐
│ Add Equipment                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name:   Mouse                                    │
│ Type:   Mouse                                    │
│ Serial: N/A                                      │
│                                                  │
│                            [Save] ✓              │
└─────────────────────────────────────────────────┘

First mouse with N/A serial - SUCCESS
```

```
┌─────────────────────────────────────────────────┐
│ Add Equipment                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name:   Mouse                                    │
│ Type:   Mouse                                    │
│ Serial: N/A                                      │
│                                                  │
│                            [Save] ✗              │
└─────────────────────────────────────────────────┘

BEFORE: Second mouse with N/A serial - ERROR
❌ "Equipment with this serial already exists"
```

### After Fix

```
┌─────────────────────────────────────────────────┐
│ Add Equipment                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name:   Mouse #1                                 │
│ Type:   Mouse                                    │
│ Serial: N/A                                      │
│                                                  │
│                            [Save] ✓              │
└─────────────────────────────────────────────────┘

First mouse - SUCCESS
```

```
┌─────────────────────────────────────────────────┐
│ Add Equipment                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name:   Mouse #2                                 │
│ Type:   Mouse                                    │
│ Serial: N/A                                      │
│                                                  │
│                            [Save] ✓              │
└─────────────────────────────────────────────────┘

AFTER: Second mouse - SUCCESS
✓ Multiple N/A serials allowed
```

### Real Serial Protection Still Works

```
┌─────────────────────────────────────────────────┐
│ Add Equipment                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name:   Laptop #1                                │
│ Type:   Laptop                                   │
│ Serial: ABC123                                   │
│                                                  │
│                            [Save] ✓              │
└─────────────────────────────────────────────────┘

First laptop with ABC123 - SUCCESS
```

```
┌─────────────────────────────────────────────────┐
│ Add Equipment                                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ Name:   Laptop #2                                │
│ Type:   Laptop                                   │
│ Serial: ABC123                                   │
│                                                  │
│                            [Save] ✗              │
└─────────────────────────────────────────────────┘

Second laptop with same serial - ERROR
❌ "Equipment with this serial already exists"
✓ Real serials still protected
```

---

## Responsive Design

### Desktop View (Large Screens)

```
┌────────────────────────────────────────────────────────────┐
│ Ion Popescu                            [În așteptare]       │
│ Laptop Dell Latitude ABC123                                │
│ București - Sediu Central • alocat acum 2 zile             │
│                                                             │
│               [Generează PV] [📧 Trimite]                   │
│               └── Primary   └── Outline                     │
└────────────────────────────────────────────────────────────┘

Both buttons show full text
```

### Mobile View (Small Screens)

```
┌────────────────────────────────┐
│ Ion Popescu     [În așteptare] │
│ Laptop Dell Latitude ABC123    │
│ București • 2 zile             │
│                                │
│   [Generează PV]  [📧]         │
│   └── Text      └── Icon only  │
└────────────────────────────────┘

"Trimite" text hidden, icon remains
```

---

## Button States

### Normal State

```
┌─────────────────────────────────────┐
│  [Generează PV]    [📧 Trimite]     │
│  └── Blue          └── White/Border │
└─────────────────────────────────────┘

Ready to click
```

### Generating State

```
┌─────────────────────────────────────┐
│  [⌛ Se generează…] [📧 Trimite]     │
│  └── Disabled       └── Disabled    │
└─────────────────────────────────────┘

Both buttons disabled during generation
```

### No Email State

```
┌─────────────────────────────────────┐
│  [Generează PV]                     │
│  └── Only button shown              │
└─────────────────────────────────────┘

Send button hidden completely
```

---

## Toast Notifications

### Success - With Email

```
┌────────────────────────────────────────┐
│ ✓ PV generat și email deschis         │
│                                        │
│ Atașați manual fișierul                │
│ pv-ion-popescu.pdf în emailul către   │
│ Ion Popescu.                           │
│                                   [✕]  │
└────────────────────────────────────────┘

Reminds user to attach file
```

### Success - Without Email

```
┌────────────────────────────────────────┐
│ ✓ Proces verbal generat                │
│                                        │
│ Documentul pentru Ion Popescu a fost   │
│ descărcat.                             │
│                                   [✕]  │
└────────────────────────────────────────┘

Standard success message
```

### Error - No Email

```
┌────────────────────────────────────────┐
│ ⚠ Email lipsă                          │
│                                        │
│ Angajatul Ion Popescu nu are o adresă │
│ de email asociată.                     │
│                                   [✕]  │
└────────────────────────────────────────┘

Validation prevents action
```

---

## Use Cases

### Use Case 1: Remote Employee

```
Scenario: Employee works from home, needs to sign PV electronically

Steps:
1. HR generates PV
2. Clicks "Trimite" button
3. Email opens with employee address
4. HR attaches PDF, writes: "Please sign and return"
5. Sends email
6. Employee signs digitally and replies

Result: ✓ Document delivered electronically
```

### Use Case 2: Office Employee

```
Scenario: Employee picks up equipment in person

Steps:
1. HR generates PV
2. Clicks "Generează PV" only
3. PDF downloads
4. HR prints document
5. Employee signs in person

Result: ✓ Traditional paper workflow maintained
```

### Use Case 3: Bulk Processing

```
Scenario: 10 employees need PVs

Option A - Individual with email:
1. Click "Generează toate"
2. All PDFs download
3. Manually email each employee

Option B - Individual with send button:
1. For each employee with email:
   - Click "Trimite"
   - Email opens
   - Attach and send
2. For employees without email:
   - Click "Generează PV"
   - Print and deliver in person

Result: ✓ Flexible workflow for mixed scenarios
```

---

## Keyboard Accessibility

```
Tab Navigation:
[Generate Button] → Tab → [Send Button] → Tab → [Next Item]
      ↓                         ↓
   Enter/Space             Enter/Space
      ↓                         ↓
  Generates PV            Opens Email Client

ARIA Labels:
- "Generează PV pentru Ion Popescu"
- "Generează și trimite pentru semnare către Ion Popescu"
- Title: "Generează PV și deschide email pentru semnătură"
```

---

## Error Handling

### Network Error

```
┌────────────────────────────────────────┐
│ ✕ Eroare la generare                   │
│                                        │
│ Nu am putut genera procesul verbal.    │
│ Încearcă din nou.                      │
│                                   [✕]  │
└────────────────────────────────────────┘

Email client NOT opened
PDF NOT downloaded
User can retry
```

### Email Client Not Available

```
System Behavior:
- mailto: link attempts to open default email client
- If no client configured:
  - Browser shows error dialog
  - OR prompts to set up email client
  
User Solution:
- Configure default email client
- OR copy email manually: ion.popescu@company.com
- OR use webmail (Gmail, Outlook.com, etc.)
```

---

## Data Flow

### Backend Data Structure

```json
{
  "id": "uuid-123",
  "employeeId": "uuid-456",
  "employee": "Ion Popescu",
  "employeeEmail": "ion.popescu@company.com",  ← NEW
  "equipment": "Laptop Dell Latitude ABC123",
  "allocationDate": "2026-02-01T10:00:00Z",
  "location": "București - Sediu Central",
  "status": "pending"
}
```

### Frontend Type Definition

```typescript
type PvQueueItem = {
  id: string;
  employeeId: string;
  employee: string;
  employeeEmail: string | null;  // ← NEW
  equipment: string;
  allocationDate: string;
  location: string;
  status: 'pending' | 'overdue';
};
```

---

## Comparison Matrix

| Feature | Before | After |
|---------|--------|-------|
| **Email Sending** | Manual process | One-click button |
| **Email Pre-fill** | Copy-paste address | Auto-filled |
| **Subject Line** | User types | Standardized "De semnat PV" |
| **Optional** | N/A | Yes - only shows with email |
| **N/A Serials** | ❌ Blocked | ✅ Allowed |
| **Real Serials** | ✅ Protected | ✅ Still Protected |
| **Database Constraint** | Yes | Removed |
| **App Validation** | Yes | Enhanced |

---

## Quick Start Guide

### For HR Users

**To send PV via email:**
1. Look for PV in queue
2. Check if [📧 Trimite] button appears
3. Click button
4. Wait for email client to open
5. Attach the downloaded PDF
6. Write message and send

**If button doesn't appear:**
- Employee has no email
- Use [Generează PV] instead
- Print and deliver in person

### For Developers

**Testing the email feature:**
```bash
# 1. Ensure employee has email in database
# 2. Allocate equipment to employee
# 3. Check dashboard PV queue
# 4. Verify send button appears
# 5. Click and verify mailto: opens
```

**Testing N/A serials:**
```bash
# 1. Add equipment with serial "N/A"
# 2. Add another equipment with serial "N/A"
# 3. Both should succeed
# 4. Try real serial duplicate - should fail
```

---

## Support & Troubleshooting

### Common Issues

**Q: Send button doesn't appear**
A: Employee has no email address. Add email in employee profile.

**Q: Email client doesn't open**
A: No default email client configured. Set up Outlook, Gmail, etc.

**Q: Can't attach PDF**
A: Manual attachment required. Find file in downloads folder.

**Q: Still can't add N/A serial**
A: Database migration not run. Execute: `npm run prisma:migrate:deploy`

---

**Version**: 1.0.0
**Last Updated**: February 3, 2026
**Status**: Production Ready ✅
