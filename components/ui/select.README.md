# SelectWithFetch Component

A flexible and reusable select component that fetches data from an API endpoint with search functionality.

## Features

- **Dynamic data fetching** from any API endpoint
- **Search functionality** with debounced input
- **Flexible label formatting** using custom formatters
- **Proper URL handling** that preserves existing query parameters
- **Loading states** and error handling
- **TypeScript support** with generic types

## Basic Usage

```tsx
import { SelectWithFetch } from "@/components/ui/select"

<SelectWithFetch
  fetchUrl="/api/users"
  value={selectedUserId}
  onChange={setSelectedUserId}
  placeholder="Select a user..."
/>
```

## Advanced Usage with Custom Formatter

```tsx
import { SelectWithFetch } from "@/components/ui/select"
import { userFullNameEmailFormatter } from "@/lib/label-formatters"

<SelectWithFetch
  fetchUrl="/api/users?roles=admin"
  value={selectedUserId}
  onChange={setSelectedUserId}
  valueKey="uuid"
  labelFormatter={userFullNameEmailFormatter}
  searchParam="search"
  placeholder="Select an admin user..."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fetchUrl` | `string` | - | **Required.** API endpoint to fetch data from |
| `value` | `string` | - | **Required.** Currently selected value |
| `onChange` | `(value: string) => void` | - | **Required.** Callback when selection changes |
| `valueKey` | `string` | `"uuid"` | Key to use for option values |
| `labelKey` | `string` | `"name"` | Key to use for option labels (ignored if `labelFormatter` is provided) |
| `labelFormatter` | `(item: T) => string` | - | Custom function to format option labels |
| `searchParam` | `string` | `"search"` | Query parameter name for search |
| `placeholder` | `string` | `"Select..."` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the select is disabled |

## Label Formatters

The component supports flexible label formatting through the `labelFormatter` prop. We provide common formatters in `@/lib/label-formatters`:

### Pre-built Formatters

```tsx
import {
  userFullNameEmailFormatter,    // "John Doe (john@example.com)"
  userFullNameFormatter,         // "John Doe"
  userEmailFormatter,            // "john@example.com"
  entityNameFormatter,           // "Entity Name"
  entityNameIdFormatter,         // "Entity Name (ID123)"
} from "@/lib/label-formatters"
```

### Custom Formatters

```tsx
// Custom formatter for products
const productFormatter = (product: any) => {
  return `${product.name} - $${product.price}`
}

<SelectWithFetch
  fetchUrl="/api/products"
  labelFormatter={productFormatter}
  // ... other props
/>
```

### Generic Formatters

```tsx
import { createPrimarySecondaryFormatter } from "@/lib/label-formatters"

// Create a reusable formatter
const companyFormatter = createPrimarySecondaryFormatter('name', 'industry')

<SelectWithFetch
  fetchUrl="/api/companies"
  labelFormatter={companyFormatter}
  // ... other props
/>
```

## API Response Format

The component expects the API to return data in this format:

```json
{
  "items": [
    {
      "uuid": "123",
      "name": "Item Name",
      "email": "item@example.com"
    }
  ]
}
```

## URL Handling

The component intelligently handles URLs:

- **Without search**: `/api/users?roles=admin` → `/api/users?roles=admin`
- **With search**: `/api/users?roles=admin` + search "john" → `/api/users?roles=admin&search=john`

Existing query parameters in `fetchUrl` are preserved when adding search parameters.

## Integration with UserForm

When using with the `UserForm` component:

```tsx
const fields = [
  {
    name: "user_id",
    label: "Select User",
    type: "selectWithFetch" as const,
    fetchUrl: "/api/users",
    valueKey: "uuid",
    labelFormatter: userFullNameEmailFormatter,
    placeholder: "Choose a user...",
  }
]
```

## Examples

### Users with Full Name and Email

```tsx
<SelectWithFetch
  fetchUrl="/api/users?roles=ime,vss"
  value={selectedUser}
  onChange={setSelectedUser}
  labelFormatter={userFullNameEmailFormatter}
  placeholder="Select IME/VSS user..."
/>
```

### Products with Name and Price

```tsx
<SelectWithFetch
  fetchUrl="/api/products"
  value={selectedProduct}
  onChange={setSelectedProduct}
  labelFormatter={(product) => `${product.name} - $${product.price}`}
  placeholder="Select a product..."
/>
```

### Companies with Custom Search Parameter

```tsx
<SelectWithFetch
  fetchUrl="/api/companies"
  value={selectedCompany}
  onChange={setSelectedCompany}
  searchParam="query"
  labelFormatter={(company) => `${company.name} (${company.industry})`}
  placeholder="Search companies..."
/>
```

## Best Practices

1. **Use pre-built formatters** when possible for consistency
2. **Create reusable custom formatters** for domain-specific entities
3. **Handle loading and error states** in parent components
4. **Use TypeScript interfaces** for better type safety
5. **Keep formatters simple** and focused on display logic only

## Migration from Old Implementation

If you're migrating from the old hardcoded implementation:

**Before:**

```tsx
<SelectWithFetch
  fetchUrl="/users?roles=ime,vss"
  labelKey="full_name_email"  // Hardcoded special case
/>
```

**After:**

```tsx
<SelectWithFetch
  fetchUrl="/users?roles=ime,vss"
  labelFormatter={userFullNameEmailFormatter}  // Flexible and reusable
/>
