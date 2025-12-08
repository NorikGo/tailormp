# 📊 Analytics Quick Reference Card

## 🚀 Quick Start

```typescript
// 1. Track custom events
import { track } from '@vercel/analytics';

track('event_name', {
  property: 'value'
});

// 2. View metrics
// Vercel Dashboard → Project → Analytics tab
```

---

## 📈 Common Events

### E-Commerce
```typescript
// Product interaction
track('product_viewed', { product_id: '123', category: 'suits' });
track('add_to_cart', { product_id: '123', price: 299.99 });
track('remove_from_cart', { product_id: '123' });

// Checkout
track('checkout_started', { cart_value: 899.99, items: 3 });
track('payment_info_entered', { method: 'card' });
track('purchase_completed', {
  order_id: 'ord_123',
  total: 899.99,
  items: 3
});
```

### User Actions
```typescript
// Authentication
track('signup_completed', { method: 'email', role: 'customer' });
track('login_completed', { method: 'email' });

// Profile
track('profile_updated', { fields: ['name', 'address'] });
track('measurement_saved', { method: 'manual' });
```

### Engagement
```typescript
// Reviews
track('review_submitted', {
  product_id: '123',
  rating: 5
});

// Search
track('search_performed', {
  query: 'anzüge',
  results: 42
});

// Filters
track('filter_applied', {
  filters: ['price', 'category'],
  results: 15
});
```

---

## 🎯 Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| **LCP** | <2.5s | Monitor after deploy |
| **FID** | <100ms | Monitor after deploy |
| **CLS** | <0.1 | Monitor after deploy |
| **FCP** | <1.8s | Monitor after deploy |
| **TTFB** | <800ms | Monitor after deploy |

---

## 🔍 Debugging

### Local Development
```bash
# Open browser console
npm run dev

# You'll see:
[Web Vitals] { name: 'LCP', value: 2100, rating: 'good' }
```

### Production
```bash
# View logs
vercel logs

# Check analytics
vercel analytics
```

---

## 📊 Dashboard Navigation

**Vercel Dashboard → Your Project → Analytics**

**Sections:**
1. **Overview** - Page views, visitors, bounce rate
2. **Pages** - Top pages by traffic
3. **Referrers** - Traffic sources
4. **Countries** - Geographic data
5. **Devices** - Desktop vs Mobile
6. **Speed Insights** - Web Vitals scores

---

## 🚨 Performance Alerts

Set up alerts in Vercel:
1. Dashboard → Project → Settings
2. Click "Notifications"
3. Enable "Performance degraded"

---

## 🔗 Quick Links

- [Full Documentation](../VERCEL_ANALYTICS_SETUP.md)
- [Performance Guide](../PERFORMANCE_OPTIMIZATIONS.md)
- [Vercel Docs](https://vercel.com/docs/analytics)

---

**Last Updated:** 2025-12-08
