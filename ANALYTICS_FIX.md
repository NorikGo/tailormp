# Analytics Page Fix - Tailor Profile Creation

## Problem

When accessing `/tailor/analytics`, users encountered the error:
```
Fehler beim Laden der Analytics
```

**Root Cause**: The analytics API ([/api/tailors/analytics](app/api/tailors/analytics/route.ts)) requires a Tailor profile to exist in the database, but the registration flow only created a User record with `role: "tailor"` - it did NOT create the corresponding Tailor profile.

## Solution

Implemented automatic Tailor profile creation in **3 places**:

### 1. Registration Route (For New Users)
**File**: [app/api/auth/register/route.ts](app/api/auth/register/route.ts)

When a user registers with `role: "tailor"`, the system now automatically creates a Tailor profile:

```typescript
// If role is tailor, create tailor profile automatically
if (validatedData.role === "tailor") {
  await prisma.tailor.create({
    data: {
      user_id: newUser.id,
      name: validatedData.email.split("@")[0], // Default name from email
      bio: "",
      country: "",
      languages: [],
      rating: 0,
      totalOrders: 0,
      yearsExperience: 0,
      specialties: [],
      isVerified: false,
    },
  });
}
```

### 2. Login Route (For Existing Users)
**File**: [app/api/auth/login/route.ts](app/api/auth/login/route.ts)

When a tailor logs in, the system checks if they have a Tailor profile and creates one if missing:

```typescript
// If user is a tailor but doesn't have a tailor profile, create one
if (dbUser?.role === "tailor" && !dbUser.tailor) {
  await prisma.tailor.create({
    data: {
      user_id: data.user.id,
      name: data.user.email?.split("@")[0] || "Schneider",
      // ... default values
    },
  });
}
```

### 3. Utility API Endpoint (Manual Fix)
**File**: [app/api/user/create-tailor-profile/route.ts](app/api/user/create-tailor-profile/route.ts)

Created a utility endpoint that can be called manually to create a Tailor profile:

```bash
POST /api/user/create-tailor-profile
```

This endpoint:
- Checks if user is authenticated
- Verifies user has `role: "tailor"`
- Creates Tailor profile if it doesn't exist
- Returns the created profile

## How to Fix Existing Accounts

If you registered as a tailor **before this fix**, you have 2 options:

### Option 1: Logout and Login Again (Recommended)
1. Logout from your account
2. Login again
3. The system will automatically create your Tailor profile
4. Navigate to `/tailor/analytics` - it should work now!

### Option 2: Call the Utility Endpoint
1. Stay logged in
2. Open browser console (F12)
3. Run:
```javascript
fetch('/api/user/create-tailor-profile', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```
4. Refresh the page

## What This Fixes

- ✅ `/tailor/analytics` page now loads without errors
- ✅ Analytics data displays correctly (revenue, orders, charts)
- ✅ New tailor registrations automatically get a profile
- ✅ Existing tailors get a profile on next login
- ✅ All tailor-specific API endpoints now work properly

## Related Files Modified

1. [app/api/auth/register/route.ts](app/api/auth/register/route.ts:55-71) - Auto-create profile on registration
2. [app/api/auth/login/route.ts](app/api/auth/login/route.ts:45-61) - Auto-create profile on login
3. [app/api/user/create-tailor-profile/route.ts](app/api/user/create-tailor-profile/route.ts) - Manual creation endpoint

## Technical Details

The Tailor profile is stored in the `Tailor` table with these default values:
- `name`: Extracted from email (before @ symbol)
- `bio`: Empty string (user can fill later)
- `country`: Empty string
- `languages`: Empty array
- `rating`: 0
- `totalOrders`: 0
- `yearsExperience`: 0
- `specialties`: Empty array
- `isVerified`: false

These values can be updated later through the tailor profile edit page at `/tailor/profile/edit`.

## Testing

To verify the fix works:
1. Register a new tailor account OR logout and login to existing tailor account
2. Navigate to `/tailor/analytics`
3. You should see the analytics dashboard with:
   - Overview metrics (revenue, orders, avg order value, platform fee)
   - Period selector (7/30/90/365 days)
   - Revenue chart
   - Order status breakdown
   - Top 5 products
   - Recent orders

If you see "Noch keine Bestellungen verfügbar" that's normal - it means you don't have any orders yet, but the page is working!
