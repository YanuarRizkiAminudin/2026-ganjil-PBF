# Requirements Document

## Introduction

Fitur Product Management menambahkan kemampuan CRUD penuh (Create, Read, Update, Delete) untuk data produk pada aplikasi Next.js yang sudah ada. Saat ini data produk disimpan sebagai array in-memory di dalam API route dan hanya mendukung operasi baca (GET). Fitur ini akan memperluas API yang ada, menyediakan antarmuka manajemen produk di halaman admin dan editor, dan memastikan semua operasi tulis dilindungi oleh autentikasi berbasis peran yang sudah ada.

## Glossary

- **Product_API**: API route Next.js di `/api/produk` yang menangani operasi CRUD produk.
- **Product_Store**: Penyimpanan data produk in-memory (array) yang digunakan oleh Product_API.
- **Admin_UI**: Antarmuka manajemen produk yang dapat diakses di halaman `/admin` oleh pengguna dengan role `admin`.
- **Editor_UI**: Antarmuka manajemen produk yang dapat diakses di halaman `/editor` oleh pengguna dengan role `editor` atau `admin`.
- **Product_Form**: Komponen form yang digunakan untuk membuat dan mengedit produk.
- **Product**: Entitas dengan field: `id` (string), `name` (string), `price` (string numerik tanpa pemisah titik/koma), `category` (string), `size` (string), `image` (string URL).
- **Admin**: Pengguna dengan role `admin` yang memiliki akses penuh ke semua operasi CRUD.
- **Editor**: Pengguna dengan role `editor` yang memiliki akses ke operasi Create dan Update produk.
- **Session**: Sesi autentikasi NextAuth yang berisi informasi pengguna termasuk role.
- **ID_Generator**: Mekanisme yang menghasilkan nilai `id` unik untuk setiap produk baru.
- **Valid_Price**: String yang hanya mengandung digit angka (0–9), tidak boleh mengandung titik, koma, spasi, atau karakter non-numerik lainnya, dan nilainya harus lebih besar dari 0.
- **Valid_Image_URL**: String yang dimulai dengan `https://` dan memiliki panjang tidak lebih dari 2048 karakter.
- **Valid_Name**: String dengan panjang antara 3 hingga 100 karakter, tidak boleh hanya berisi spasi.

---

## Requirements

### Requirement 1: Membuat Produk Baru

**User Story:** Sebagai admin atau editor, saya ingin membuat produk baru, agar katalog produk dapat diperbarui tanpa mengubah kode secara langsung.

#### Acceptance Criteria

1. WHEN pengguna dengan role `admin` atau `editor` mengirimkan permintaan POST ke `/api/produk` dengan body JSON yang valid, THE Product_API SHALL menambahkan produk baru ke Product_Store dan mengembalikan data produk yang dibuat dengan HTTP status 201.
2. WHEN permintaan POST ke `/api/produk` diterima, THE Product_API SHALL menghasilkan nilai `id` unik menggunakan ID_Generator dan menetapkannya ke produk baru, mengabaikan nilai `id` yang mungkin ada di dalam body permintaan.
3. IF permintaan POST ke `/api/produk` tidak menyertakan salah satu field wajib (`name`, `price`, `category`, `size`, `image`), THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Field [nama_field] wajib diisi"` untuk setiap field yang tidak ada.
4. IF permintaan POST ke `/api/produk` menyertakan field wajib dengan nilai string kosong atau hanya spasi, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Field [nama_field] tidak boleh kosong"`.
5. IF permintaan POST ke `/api/produk` menyertakan `name` yang tidak memenuhi kriteria Valid_Name, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Nama produk harus antara 3 hingga 100 karakter"`.
6. IF permintaan POST ke `/api/produk` menyertakan `price` yang tidak memenuhi kriteria Valid_Price, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Harga harus berupa angka bulat positif tanpa pemisah titik atau koma"`.
7. IF permintaan POST ke `/api/produk` menyertakan `image` yang tidak memenuhi kriteria Valid_Image_URL, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"URL gambar harus dimulai dengan https:// dan tidak melebihi 2048 karakter"`.
8. IF permintaan POST ke `/api/produk` dikirim oleh pengguna yang tidak terautentikasi, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 401 dan pesan `"Autentikasi diperlukan"`.
9. IF permintaan POST ke `/api/produk` dikirim oleh pengguna dengan role `user`, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 403 dan pesan `"Akses ditolak: hanya admin atau editor yang dapat membuat produk"`.

---

### Requirement 2: Membaca Daftar dan Detail Produk

**User Story:** Sebagai pengguna mana pun, saya ingin melihat daftar semua produk dan detail produk individual, agar saya dapat menelusuri katalog produk.

#### Acceptance Criteria

1. WHEN permintaan GET dikirim ke `/api/produk`, THE Product_API SHALL mengembalikan array semua produk yang ada di Product_Store dengan HTTP status 200.
2. WHEN permintaan GET dikirim ke `/api/produk` dengan query parameter `search` berisi string tidak kosong, THE Product_API SHALL mengembalikan hanya produk yang `name` atau `category`-nya mengandung string tersebut secara case-insensitive.
3. WHEN permintaan GET dikirim ke `/api/produk` dengan query parameter `category` berisi string tidak kosong, THE Product_API SHALL mengembalikan hanya produk yang `category`-nya sama persis secara case-insensitive dengan nilai parameter tersebut.
4. WHEN permintaan GET dikirim ke `/api/produk` dengan query parameter `sortBy` bernilai `name` atau `price`, THE Product_API SHALL mengembalikan produk yang diurutkan berdasarkan field tersebut secara ascending.
5. WHEN permintaan GET dikirim ke `/api/produk` dengan query parameter `sortBy` yang valid dan `order` bernilai `desc`, THE Product_API SHALL mengembalikan produk yang diurutkan secara descending.
6. IF permintaan GET dikirim ke `/api/produk` dengan query parameter `sortBy` yang nilainya bukan `name` atau `price`, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Parameter sortBy hanya menerima nilai 'name' atau 'price'"`.
7. WHEN permintaan GET dikirim ke `/api/produk/[id]` dengan `id` yang valid, THE Product_API SHALL mengembalikan objek produk yang sesuai dengan HTTP status 200.
8. IF permintaan GET dikirim ke `/api/produk/[id]` dengan `id` yang tidak ada di Product_Store, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 404 dan pesan `"Produk dengan id '[id]' tidak ditemukan"`.
9. THE Product_API SHALL mengembalikan data produk dalam format JSON yang konsisten dengan struktur Product (`id`, `name`, `price`, `category`, `size`, `image`).
10. IF permintaan GET dikirim ke `/api/produk` dan Product_Store kosong, THEN THE Product_API SHALL mengembalikan array kosong `[]` dengan HTTP status 200.

---

### Requirement 3: Memperbarui Produk

**User Story:** Sebagai admin atau editor, saya ingin memperbarui informasi produk yang sudah ada, agar data produk tetap akurat dan terkini.

#### Acceptance Criteria

1. WHEN pengguna dengan role `admin` atau `editor` mengirimkan permintaan PUT ke `/api/produk/[id]` dengan body JSON yang valid, THE Product_API SHALL memperbarui produk yang sesuai di Product_Store dan mengembalikan data produk yang diperbarui dengan HTTP status 200.
2. IF permintaan PUT ke `/api/produk/[id]` dikirim dengan `id` yang tidak ada di Product_Store, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 404 dan pesan `"Produk dengan id '[id]' tidak ditemukan"`.
3. IF permintaan PUT ke `/api/produk/[id]` tidak menyertakan salah satu field wajib (`name`, `price`, `category`, `size`, `image`), THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Field [nama_field] wajib diisi"` untuk setiap field yang tidak ada.
4. IF permintaan PUT ke `/api/produk/[id]` menyertakan field wajib dengan nilai string kosong atau hanya spasi, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Field [nama_field] tidak boleh kosong"`.
5. IF permintaan PUT ke `/api/produk/[id]` menyertakan `name` yang tidak memenuhi kriteria Valid_Name, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Nama produk harus antara 3 hingga 100 karakter"`.
6. IF permintaan PUT ke `/api/produk/[id]` menyertakan `price` yang tidak memenuhi kriteria Valid_Price, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"Harga harus berupa angka bulat positif tanpa pemisah titik atau koma"`.
7. IF permintaan PUT ke `/api/produk/[id]` menyertakan `image` yang tidak memenuhi kriteria Valid_Image_URL, THEN THE Product_API SHALL mengembalikan respons error dengan HTTP status 400 dan pesan `"URL gambar harus dimulai dengan https:// dan tidak melebihi 2048 karakter"`.
8. IF permintaan PUT ke `/api/produk/[id]` dikirim oleh pengguna yang tidak terautentikasi, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 401 dan pesan `"Autentikasi diperlukan"`.
9. IF permintaan PUT ke `/api/produk/[id]` dikirim oleh pengguna dengan role `user`, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 403 dan pesan `"Akses ditolak: hanya admin atau editor yang dapat memperbarui produk"`.
10. WHEN produk diperbarui, THE Product_API SHALL mempertahankan nilai `id` produk yang asli dan tidak mengizinkan perubahan `id` melalui body permintaan.

---

### Requirement 4: Menghapus Produk

**User Story:** Sebagai admin, saya ingin menghapus produk yang sudah tidak relevan, agar katalog produk tetap bersih dan terorganisir.

#### Acceptance Criteria

1. WHEN pengguna dengan role `admin` mengirimkan permintaan DELETE ke `/api/produk/[id]` dengan `id` yang valid, THE Product_API SHALL menghapus produk yang sesuai dari Product_Store dan mengembalikan respons dengan HTTP status 200 dan pesan `"Produk berhasil dihapus"`.
2. IF permintaan DELETE ke `/api/produk/[id]` dikirim dengan `id` yang tidak ada di Product_Store, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 404 dan pesan `"Produk dengan id '[id]' tidak ditemukan"`.
3. IF permintaan DELETE ke `/api/produk/[id]` dikirim oleh pengguna yang tidak terautentikasi, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 401 dan pesan `"Autentikasi diperlukan"`.
4. IF permintaan DELETE ke `/api/produk/[id]` dikirim oleh pengguna dengan role `editor`, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 403 dan pesan `"Akses ditolak: hanya admin yang dapat menghapus produk"`.
5. IF permintaan DELETE ke `/api/produk/[id]` dikirim oleh pengguna dengan role `user`, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 403 dan pesan `"Akses ditolak: hanya admin yang dapat menghapus produk"`.

---

### Requirement 5: Penanganan HTTP Method yang Tidak Didukung

**User Story:** Sebagai developer yang mengintegrasikan API, saya ingin menerima respons yang jelas ketika menggunakan HTTP method yang salah, agar saya dapat dengan cepat mengidentifikasi kesalahan integrasi.

#### Acceptance Criteria

1. IF permintaan dengan HTTP method selain GET dan POST dikirim ke `/api/produk`, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 405 dan pesan `"Method [nama_method] tidak diizinkan"`.
2. IF permintaan dengan HTTP method selain GET, PUT, dan DELETE dikirim ke `/api/produk/[id]`, THEN THE Product_API SHALL mengembalikan respons dengan HTTP status 405 dan pesan `"Method [nama_method] tidak diizinkan"`.

---

### Requirement 6: Antarmuka Manajemen Produk di Admin Panel

**User Story:** Sebagai admin, saya ingin mengelola produk melalui antarmuka visual di halaman admin, agar saya dapat melakukan operasi CRUD tanpa perlu menggunakan alat eksternal seperti Postman.

#### Acceptance Criteria

1. WHEN pengguna dengan role `admin` mengakses halaman `/admin`, THE Admin_UI SHALL menampilkan daftar semua produk yang diambil dari `/api/produk`.
2. WHILE Admin_UI sedang mengambil data dari Product_API, THE Admin_UI SHALL menampilkan indikator loading kepada pengguna.
3. WHEN Admin_UI menampilkan daftar produk, THE Admin_UI SHALL menampilkan `name`, `price`, `category`, `size`, dan thumbnail `image` untuk setiap produk.
4. WHEN pengguna mengklik tombol "Tambah Produk", THE Admin_UI SHALL menampilkan Product_Form dalam keadaan kosong untuk membuat produk baru.
5. WHEN pengguna mengklik tombol "Edit" pada baris produk, THE Admin_UI SHALL menampilkan Product_Form yang sudah terisi dengan data produk yang dipilih.
6. WHEN pengguna mengklik tombol "Hapus" pada baris produk, THE Admin_UI SHALL menampilkan dialog konfirmasi yang menyebutkan nama produk sebelum mengirimkan permintaan DELETE.
7. WHEN Product_Form berhasil disubmit untuk membuat atau memperbarui produk, THE Admin_UI SHALL memperbarui daftar produk yang ditampilkan untuk mencerminkan perubahan terbaru tanpa memuat ulang halaman.
8. IF Product_API mengembalikan error saat operasi CRUD, THE Admin_UI SHALL menampilkan pesan error yang diterima dari API kepada pengguna.
9. THE Product_Form SHALL memvalidasi bahwa semua field wajib (`name`, `price`, `category`, `size`, `image`) terisi dan memenuhi aturan validasi sebelum mengirimkan permintaan ke Product_API.
10. WHEN pengguna memasukkan nilai `price` di Product_Form, THE Product_Form SHALL hanya menerima input digit angka dan menolak karakter non-numerik.
11. WHEN pengguna memasukkan nilai `image` di Product_Form, THE Product_Form SHALL memvalidasi bahwa nilai dimulai dengan `https://` sebelum mengizinkan submit.
12. WHEN Admin_UI menampilkan daftar produk, THE Admin_UI SHALL menyediakan input pencarian yang memfilter daftar produk berdasarkan `name` atau `category` secara real-time.

---

### Requirement 7: Akses Editor ke Manajemen Produk

**User Story:** Sebagai editor, saya ingin dapat membuat dan mengedit produk dari halaman editor, agar saya dapat berkontribusi pada pengelolaan konten produk sesuai izin yang diberikan.

#### Acceptance Criteria

1. WHEN pengguna dengan role `editor` mengakses halaman `/editor`, THE Editor_UI SHALL menampilkan daftar produk beserta tombol "Tambah Produk" dan "Edit".
2. WHILE pengguna memiliki role `editor`, THE Editor_UI SHALL menyembunyikan tombol "Hapus" dari tampilan daftar produk.
3. WHEN pengguna dengan role `editor` berhasil membuat atau mengedit produk, THE Editor_UI SHALL memperbarui daftar produk yang ditampilkan tanpa memuat ulang halaman.
4. WHILE pengguna memiliki role `editor`, THE Editor_UI SHALL menampilkan pesan informasi yang menjelaskan bahwa operasi hapus hanya tersedia untuk admin.

---

### Requirement 8: Konsistensi Data Product_Store

**User Story:** Sebagai developer, saya ingin Product_Store berperilaku konsisten di seluruh operasi, agar data produk tetap valid dan tidak ada duplikasi atau inkonsistensi.

#### Acceptance Criteria

1. THE Product_Store SHALL memastikan setiap produk memiliki nilai `id` yang unik di seluruh koleksi.
2. WHEN produk baru ditambahkan ke Product_Store, THE Product_Store SHALL mempertahankan semua produk yang sudah ada tanpa modifikasi.
3. WHEN produk dihapus dari Product_Store, THE Product_Store SHALL mengembalikan koleksi yang berisi semua produk sebelumnya kecuali produk yang dihapus.
4. WHEN produk diperbarui di Product_Store, THE Product_Store SHALL mengembalikan koleksi dengan ukuran yang sama seperti sebelum pembaruan.
5. FOR ALL produk yang disimpan di Product_Store, THE Product_Store SHALL memastikan setiap produk memiliki semua field wajib (`id`, `name`, `price`, `category`, `size`, `image`) dengan nilai yang tidak kosong.
6. WHEN ID_Generator menghasilkan `id` baru, THE ID_Generator SHALL memverifikasi bahwa `id` tersebut belum ada di Product_Store sebelum menetapkannya ke produk baru.
