# Dokumen Desain: Product Management

## Overview

Fitur Product Management menambahkan kemampuan CRUD penuh (Create, Read, Update, Delete) untuk data produk pada aplikasi Next.js yang sudah ada. Saat ini, data produk disimpan sebagai array in-memory yang terpisah di dua API route (`/api/produk/index.ts` dan `/api/produk/[id].ts`) dan hanya mendukung operasi baca (GET).

Desain ini mencakup:
1. **Refaktor Product_Store** — menyatukan data produk ke satu modul shared in-memory store dengan dukungan operasi CRUD penuh.
2. **Perluasan Product_API** — menambahkan handler POST, PUT, DELETE beserta validasi input dan otorisasi berbasis role.
3. **Admin_UI** — antarmuka manajemen produk lengkap di halaman `/admin` untuk role `admin`.
4. **Editor_UI** — antarmuka terbatas di halaman `/editor` untuk role `editor` (Create dan Update saja).

Sistem autentikasi berbasis NextAuth dengan JWT yang sudah ada digunakan kembali tanpa modifikasi. Role `admin`, `editor`, dan `user` sudah tersedia di token sesi.

---

## Architecture

Arsitektur mengikuti pola Next.js Pages Router yang sudah ada di proyek:

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│   ┌──────────────┐          ┌──────────────────────────┐   │
│   │  Admin_UI    │          │       Editor_UI           │   │
│   │ /pages/admin │          │    /pages/editor          │   │
│   └──────┬───────┘          └────────────┬─────────────┘   │
│          │  fetch / SWR                  │  fetch / SWR     │
└──────────┼───────────────────────────────┼─────────────────┘
           │                               │
           ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│                                                             │
│   ┌──────────────────────┐  ┌──────────────────────────┐   │
│   │  /api/produk         │  │  /api/produk/[id]         │   │
│   │  GET  → list/search  │  │  GET    → get by id       │   │
│   │  POST → create       │  │  PUT    → update          │   │
│   │                      │  │  DELETE → delete          │   │
│   └──────────┬───────────┘  └────────────┬─────────────┘   │
│              │                           │                  │
│              ▼                           ▼                  │
│   ┌──────────────────────────────────────────────────────┐  │
│   │              Validation Layer                        │  │
│   │  validateProductBody() · validateQueryParams()       │  │
│   └──────────────────────┬───────────────────────────────┘  │
│                          │                                  │
│   ┌──────────────────────▼───────────────────────────────┐  │
│   │              Authorization Layer                     │  │
│   │  checkAuth(session, allowedRoles)                    │  │
│   └──────────────────────┬───────────────────────────────┘  │
│                          │                                  │
│   ┌──────────────────────▼───────────────────────────────┐  │
│   │              Product_Store (in-memory)               │  │
│   │  productStore.ts — shared singleton module           │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Keputusan Desain: In-Memory Store**

Karena proyek ini menggunakan array in-memory (bukan database), Product_Store diimplementasikan sebagai modul singleton TypeScript yang di-share antar API route. Ini mempertahankan konsistensi data selama server berjalan tanpa memerlukan perubahan infrastruktur.

**Keputusan Desain: Validasi di API Layer**

Validasi dilakukan di API route sebelum menyentuh store, bukan di store itu sendiri. Ini memisahkan concern antara business rules (API) dan data storage (store).

---

## Components and Interfaces

### 1. Product_Store (`src/lib/productStore.ts`)

Modul singleton yang menyimpan dan mengelola koleksi produk in-memory.

```typescript
// src/lib/productStore.ts

import { ProductType } from '@/types/Product.type';

// Singleton store — shared across all API route invocations
let products: ProductType[] = [ /* data awal */ ];

export function getAllProducts(): ProductType[]
export function getProductById(id: string): ProductType | undefined
export function addProduct(data: Omit<ProductType, 'id'>): ProductType
export function updateProduct(id: string, data: Omit<ProductType, 'id'>): ProductType | null
export function deleteProduct(id: string): boolean
export function generateUniqueId(): string
```

**Catatan**: `generateUniqueId()` menggunakan `crypto.randomUUID()` (tersedia di Node.js 14.17+) dan memverifikasi keunikan terhadap store sebelum mengembalikan nilai.

---

### 2. Validation Layer (`src/lib/validateProduct.ts`)

Fungsi-fungsi validasi yang dapat digunakan kembali oleh kedua API route.

```typescript
// src/lib/validateProduct.ts

export type ValidationError = {
  field: string;
  message: string;
};

export function validateProductBody(
  body: Partial<ProductType>
): ValidationError[]

export function isValidPrice(price: string): boolean
export function isValidImageUrl(url: string): boolean
export function isValidName(name: string): boolean
```

**Aturan Validasi:**
- `isValidName`: panjang 3–100 karakter, tidak boleh hanya spasi
- `isValidPrice`: hanya digit (0–9), nilai > 0 (tidak boleh "0" atau "00")
- `isValidImageUrl`: dimulai dengan `https://`, panjang ≤ 2048 karakter

---

### 3. Authorization Helper (`src/lib/authHelper.ts`)

```typescript
// src/lib/authHelper.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export type AuthResult =
  | { authorized: true; role: string }
  | { authorized: false; status: 401 | 403; message: string };

export async function checkAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: string[]
): Promise<AuthResult>
```

---

### 4. API Route: `/api/produk` (`src/pages/api/produk/index.ts`)

Menangani operasi koleksi produk.

| Method | Auth Required | Roles Allowed | Deskripsi |
|--------|--------------|---------------|-----------|
| GET    | Tidak        | Semua         | List produk dengan filter/sort opsional |
| POST   | Ya           | admin, editor | Buat produk baru |
| Lainnya | -           | -             | 405 Method Not Allowed |

**Query Parameters untuk GET:**
- `search` (string): filter berdasarkan `name` atau `category` (case-insensitive)
- `category` (string): filter berdasarkan `category` (case-insensitive exact match)
- `sortBy` (`name` | `price`): urutkan hasil
- `order` (`asc` | `desc`, default: `asc`): arah pengurutan

---

### 5. API Route: `/api/produk/[id]` (`src/pages/api/produk/[id].ts`)

Menangani operasi pada produk individual.

| Method | Auth Required | Roles Allowed | Deskripsi |
|--------|--------------|---------------|-----------|
| GET    | Tidak        | Semua         | Ambil produk berdasarkan id |
| PUT    | Ya           | admin, editor | Perbarui produk |
| DELETE | Ya           | admin         | Hapus produk |
| Lainnya | -           | -             | 405 Method Not Allowed |

---

### 6. ProductForm Component (`src/components/ProductForm.tsx`)

Komponen form yang digunakan bersama oleh Admin_UI dan Editor_UI.

```typescript
// src/components/ProductForm.tsx

type ProductFormProps = {
  initialData?: ProductType;       // Jika ada, mode edit; jika tidak, mode create
  onSuccess: (product: ProductType) => void;
  onCancel: () => void;
};

export default function ProductForm({
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps): JSX.Element
```

**Validasi Client-Side:**
- Field `price`: hanya menerima input digit (event handler `onKeyDown` menolak karakter non-digit)
- Field `image`: validasi `https://` prefix sebelum submit
- Semua field wajib divalidasi sebelum request dikirim ke API

---

### 7. Admin_UI (`src/pages/admin/index.tsx`)

Halaman manajemen produk lengkap untuk role `admin`. Menggunakan SWR untuk data fetching dan revalidasi otomatis.

**State Management:**
- `products`: daftar produk dari API (via SWR)
- `formMode`: `null` | `'create'` | `'edit'`
- `selectedProduct`: produk yang sedang diedit
- `deleteTarget`: produk yang akan dihapus (untuk dialog konfirmasi)
- `searchQuery`: string pencarian real-time
- `error`: pesan error dari API

---

### 8. Editor_UI (`src/pages/editor/index.tsx`)

Halaman manajemen produk terbatas untuk role `editor`. Sama dengan Admin_UI tetapi tanpa tombol "Hapus" dan dengan pesan informasi tentang keterbatasan role.

---

## Data Models

### ProductType

```typescript
// src/types/Product.type.ts (sudah ada, tidak berubah)

export type ProductType = {
  id: string;       // UUID yang di-generate oleh sistem
  name: string;     // 3–100 karakter, tidak boleh hanya spasi
  price: string;    // String digit saja, nilai > 0
  category: string; // Tidak boleh kosong
  size: string;     // Tidak boleh kosong
  image: string;    // URL https://, max 2048 karakter
};
```

### API Request Body (Create/Update)

```typescript
type ProductRequestBody = Omit<ProductType, 'id'>;
// { name, price, category, size, image }
// Field 'id' diabaikan jika ada di body
```

### API Response Formats

**Sukses — List Produk (GET /api/produk):**
```json
[
  { "id": "...", "name": "...", "price": "...", "category": "...", "size": "...", "image": "..." }
]
```

**Sukses — Produk Tunggal (GET /api/produk/[id], POST, PUT):**
```json
{ "id": "...", "name": "...", "price": "...", "category": "...", "size": "...", "image": "..." }
```

**Sukses — Delete (DELETE /api/produk/[id]):**
```json
{ "message": "Produk berhasil dihapus" }
```

**Error:**
```json
{ "message": "Pesan error yang deskriptif" }
```

**Error Validasi (400) — Multiple Fields:**
```json
{
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "Field name wajib diisi" },
    { "field": "price", "message": "Field price wajib diisi" }
  ]
}
```

### Session/JWT (sudah ada, tidak berubah)

```typescript
// Dari next-auth.d.ts yang sudah ada
session.user = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string; // 'admin' | 'editor' | 'user'
};
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Validasi menolak semua input tidak valid

*For any* permintaan POST atau PUT ke Product_API dengan satu atau lebih field yang tidak memenuhi aturan validasi (field hilang, kosong/hanya spasi, `name` di luar 3–100 karakter, `price` mengandung karakter non-digit atau bernilai 0, `image` tidak dimulai dengan `https://` atau melebihi 2048 karakter), API SHALL mengembalikan HTTP status 400 dan tidak memodifikasi Product_Store.

**Validates: Requirements 1.3, 1.4, 1.5, 1.6, 1.7, 3.3, 3.4, 3.5, 3.6, 3.7**

---

### Property 2: Penambahan produk mempertahankan produk yang sudah ada

*For any* Product_Store dengan N produk dan data produk baru yang valid, setelah operasi POST berhasil, Product_Store SHALL mengandung N+1 produk di mana semua N produk sebelumnya tetap ada tanpa modifikasi, dan produk baru dapat ditemukan dengan id yang di-generate sistem.

**Validates: Requirements 1.1, 8.2**

---

### Property 3: Id produk selalu unik dan di-generate sistem

*For any* jumlah operasi POST yang berhasil, semua produk di Product_Store SHALL memiliki nilai `id` yang unik satu sama lain, dan `id` tersebut SHALL berbeda dari nilai `id` yang mungkin dikirim di dalam body permintaan.

**Validates: Requirements 1.2, 8.1, 8.6**

---

### Property 4: Filter pencarian mengembalikan hanya produk yang relevan

*For any* Product_Store dan query parameter `search` yang tidak kosong, semua produk yang dikembalikan SHALL mengandung string pencarian tersebut di dalam field `name` atau `category` secara case-insensitive, dan tidak ada produk yang memenuhi kriteria tersebut yang boleh dihilangkan dari hasil.

**Validates: Requirements 2.2**

---

### Property 5: Filter kategori mengembalikan hanya produk dengan kategori yang sesuai

*For any* Product_Store dan query parameter `category` yang tidak kosong, semua produk yang dikembalikan SHALL memiliki nilai `category` yang sama persis secara case-insensitive dengan nilai parameter tersebut.

**Validates: Requirements 2.3**

---

### Property 6: Pengurutan menghasilkan urutan yang benar

*For any* Product_Store dengan dua atau lebih produk dan query parameter `sortBy` yang valid (`name` atau `price`), produk yang dikembalikan SHALL diurutkan sesuai field tersebut — ascending jika `order=asc` (atau tidak ada), descending jika `order=desc` — sehingga setiap elemen berurutan memenuhi relasi urutan yang benar.

**Validates: Requirements 2.4, 2.5**

---

### Property 7: Round-trip get by id mengembalikan data yang sama

*For any* produk yang ada di Product_Store, melakukan GET ke `/api/produk/[id]` dengan id produk tersebut SHALL mengembalikan objek produk dengan semua field yang identik dengan data yang tersimpan di store.

**Validates: Requirements 2.7, 2.9**

---

### Property 8: Update mempertahankan ukuran store dan id asli

*For any* Product_Store dengan N produk dan operasi PUT yang valid pada produk yang ada, setelah update berhasil, Product_Store SHALL tetap mengandung tepat N produk, produk yang diperbarui SHALL memiliki data baru, dan nilai `id` produk tersebut SHALL sama dengan id aslinya (tidak berubah meskipun body permintaan menyertakan `id` yang berbeda).

**Validates: Requirements 3.1, 3.10, 8.4**

---

### Property 9: Delete menghapus tepat satu produk dan mempertahankan yang lain

*For any* Product_Store dengan N produk dan operasi DELETE yang valid pada produk dengan id tertentu, setelah delete berhasil, Product_Store SHALL mengandung tepat N-1 produk, produk dengan id tersebut SHALL tidak ada lagi di store, dan semua N-1 produk lainnya SHALL tetap ada tanpa modifikasi.

**Validates: Requirements 4.1, 8.3**

---

### Property 10: Method yang tidak didukung selalu menghasilkan 405

*For any* HTTP method yang bukan GET atau POST yang dikirim ke `/api/produk`, atau bukan GET, PUT, atau DELETE yang dikirim ke `/api/produk/[id]`, Product_API SHALL mengembalikan HTTP status 405 dengan pesan yang menyebutkan nama method tersebut.

**Validates: Requirements 5.1, 5.2**

---

### Property 11: Semua produk di store memiliki struktur data yang lengkap

*For any* operasi yang menghasilkan produk baru atau memperbarui produk di Product_Store, setiap produk yang tersimpan SHALL memiliki semua field wajib (`id`, `name`, `price`, `category`, `size`, `image`) dengan nilai yang tidak kosong.

**Validates: Requirements 8.5**

---

### Property 12: Form validasi menolak semua input price non-digit

*For any* string yang mengandung karakter non-digit (titik, koma, huruf, spasi, dll.) yang dimasukkan ke field `price` di Product_Form, form SHALL menolak karakter tersebut sehingga nilai yang tersimpan di field hanya mengandung digit angka.

**Validates: Requirements 6.10**

---

### Property 13: Admin_UI menampilkan semua field produk untuk setiap item

*For any* daftar produk yang dikembalikan oleh Product_API, Admin_UI SHALL menampilkan `name`, `price`, `category`, `size`, dan thumbnail `image` untuk setiap produk dalam daftar tersebut.

**Validates: Requirements 6.3**

---

## Error Handling

### Hierarki Error Response

Urutan pengecekan di setiap API route handler:

1. **Method Not Allowed (405)** — cek HTTP method terlebih dahulu
2. **Unauthenticated (401)** — cek keberadaan sesi
3. **Forbidden (403)** — cek role pengguna terhadap operasi
4. **Not Found (404)** — cek keberadaan resource (untuk operasi by id)
5. **Bad Request (400)** — validasi input body/query
6. **Internal Server Error (500)** — error tak terduga

### Tabel Error Response

| Kondisi | Status | Pesan |
|---------|--------|-------|
| Method tidak didukung | 405 | `"Method [METHOD] tidak diizinkan"` |
| Tidak terautentikasi | 401 | `"Autentikasi diperlukan"` |
| Role tidak cukup (write) | 403 | `"Akses ditolak: hanya admin atau editor yang dapat membuat/memperbarui produk"` |
| Role tidak cukup (delete) | 403 | `"Akses ditolak: hanya admin yang dapat menghapus produk"` |
| Id tidak ditemukan | 404 | `"Produk dengan id '[id]' tidak ditemukan"` |
| Field wajib hilang | 400 | `"Field [nama_field] wajib diisi"` |
| Field kosong/hanya spasi | 400 | `"Field [nama_field] tidak boleh kosong"` |
| Nama tidak valid | 400 | `"Nama produk harus antara 3 hingga 100 karakter"` |
| Harga tidak valid | 400 | `"Harga harus berupa angka bulat positif tanpa pemisah titik atau koma"` |
| URL gambar tidak valid | 400 | `"URL gambar harus dimulai dengan https:// dan tidak melebihi 2048 karakter"` |
| sortBy tidak valid | 400 | `"Parameter sortBy hanya menerima nilai 'name' atau 'price'"` |
| Error tak terduga | 500 | `"Terjadi kesalahan internal server"` |

### Error Handling di UI

- Semua error dari API ditangkap di `try/catch` pada fetch handler
- Pesan error dari response body API ditampilkan langsung ke pengguna
- Error jaringan (network error) menampilkan pesan generik
- State error di-reset saat pengguna memulai operasi baru

---

## Testing Strategy

### Pendekatan Dual Testing

Strategi pengujian menggunakan dua pendekatan yang saling melengkapi:

1. **Unit/Example Tests** — Jest + React Testing Library (sudah ada di proyek)
   - Menguji skenario spesifik, edge case, dan kondisi error
   - Menguji rendering UI dengan data mock

2. **Property-Based Tests** — menggunakan library **fast-check** (TypeScript/JavaScript)
   - Menguji properti universal yang harus berlaku untuk semua input valid
   - Setiap property test dikonfigurasi minimum **100 iterasi**
   - Tag format: `// Feature: product-management, Property N: [deskripsi singkat]`

### Instalasi fast-check

```bash
npm install --save-dev fast-check
```

### Struktur File Test

```
src/__test__/
├── lib/
│   ├── productStore.spec.ts        # Unit + property tests untuk store
│   ├── validateProduct.spec.ts     # Unit + property tests untuk validasi
│   └── authHelper.spec.ts          # Unit tests untuk auth helper
├── pages/
│   ├── api/
│   │   ├── produk.spec.ts          # Unit + property tests untuk /api/produk
│   │   └── produk-id.spec.ts       # Unit + property tests untuk /api/produk/[id]
│   ├── admin.spec.tsx              # Unit + property tests untuk Admin_UI
│   └── editor.spec.tsx             # Unit tests untuk Editor_UI
└── components/
    └── ProductForm.spec.tsx        # Unit + property tests untuk ProductForm
```

### Cakupan Test per Komponen

**productStore.spec.ts** (Property Tests):
- Property 2: Penambahan produk mempertahankan produk yang sudah ada
- Property 3: Id produk selalu unik dan di-generate sistem
- Property 8: Update mempertahankan ukuran store dan id asli
- Property 9: Delete menghapus tepat satu produk dan mempertahankan yang lain
- Property 11: Semua produk di store memiliki struktur data yang lengkap

**validateProduct.spec.ts** (Property Tests):
- Property 1: Validasi menolak semua input tidak valid
- Property 12: Form validasi menolak semua input price non-digit

**produk.spec.ts** dan **produk-id.spec.ts** (Property + Example Tests):
- Property 4: Filter pencarian mengembalikan hanya produk yang relevan
- Property 5: Filter kategori mengembalikan hanya produk dengan kategori yang sesuai
- Property 6: Pengurutan menghasilkan urutan yang benar
- Property 7: Round-trip get by id mengembalikan data yang sama
- Property 10: Method yang tidak didukung selalu menghasilkan 405
- Example: Unauthenticated request → 401
- Example: Role `user` → 403
- Example: Role `editor` pada DELETE → 403
- Example: Store kosong → array kosong dengan 200

**admin.spec.tsx** (Property + Example Tests):
- Property 13: Admin_UI menampilkan semua field produk untuk setiap item
- Example: Loading state ditampilkan saat fetching
- Example: Tombol "Tambah Produk" membuka form kosong
- Example: Tombol "Edit" membuka form dengan data produk
- Example: Dialog konfirmasi hapus menyebutkan nama produk
- Example: Pesan error API ditampilkan ke pengguna

**editor.spec.tsx** (Example Tests):
- Example: Tombol "Hapus" tidak ditampilkan untuk role `editor`
- Example: Pesan informasi keterbatasan role ditampilkan

### Contoh Property Test (fast-check)

```typescript
// Feature: product-management, Property 3: Id produk selalu unik dan di-generate sistem
import fc from 'fast-check';
import { addProduct, getAllProducts, resetStore } from '@/lib/productStore';

describe('Property 3: Id produk selalu unik', () => {
  beforeEach(() => resetStore());

  it('semua id produk yang di-generate harus unik', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 3, maxLength: 100 }),
            price: fc.nat({ max: 999999 }).map(n => String(n + 1)),
            category: fc.string({ minLength: 1 }),
            size: fc.string({ minLength: 1 }),
            image: fc.string({ minLength: 8 }).map(s => `https://${s}`),
          }),
          { minLength: 2, maxLength: 20 }
        ),
        (productDataList) => {
          productDataList.forEach(data => addProduct(data));
          const products = getAllProducts();
          const ids = products.map(p => p.id);
          const uniqueIds = new Set(ids);
          return uniqueIds.size === ids.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Catatan Testing

- **API route tests** menggunakan `node-mocks-http` untuk mock `req`/`res` Next.js
- **UI tests** menggunakan `jest.mock('swr')` untuk mock data fetching (pola yang sudah ada di proyek)
- **Auth tests** menggunakan `jest.mock('next-auth/next')` untuk mock `getServerSession`
- Property tests untuk validasi tidak memerlukan mock karena fungsi validasi adalah pure functions
