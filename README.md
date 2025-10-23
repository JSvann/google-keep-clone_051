# 🧭 Dokumentasi Kolaborasi GitHub dengan Branch dan Pull Request

## 📌 Tujuan
Dokumentasi ini menjelaskan alur kerja tim dalam satu repository GitHub menggunakan branch untuk setiap fitur, serta proses penggabungan (merge) ke branch utama (`main`) melalui **Pull Request (PR)**.

---

## ⚙️ 1. Persiapan Awal

1. **Leader membuat repository GitHub**
   - Buat repo baru di GitHub.
   - Pastikan branch default adalah `main`.

2. **Anggota tim melakukan clone repository**
   ```bash
   git clone https://github.com/username/nama-repo.git
   cd nama-repo
   ```

3. **Pastikan semua update terbaru dari main**
   ```bash
   git checkout main
   git pull origin main
   ```

---

## 🌳 2. Membuat Branch Baru untuk Fitur

Setiap anggota bertanggung jawab atas satu fitur.

| Nama | Branch |
|-------|---------|
| Sheva | fitur-sheva |
| Argha | fitur-argha |
| Miftah | fitur-miftah |
| Ivann | fitur-ivann |

Perintah membuat branch:
```bash
git checkout -b fitur-sheva
```
➡️ Perintah di atas akan membuat branch baru bernama `fitur-sheva`.
Branch ini otomatis **menyalin semua isi dari `main` saat itu**, jadi tidak kosong.

---

## 🧑‍💻 3. Mengembangkan Fitur di Branch Masing-masing

1. Lakukan perubahan / ngoding pada branch masing-masing.
2. Setelah selesai, commit perubahan:
   ```bash
   git add .
   git commit -m "Menambahkan fitur login"
   ```
3. Push branch ke GitHub:
   ```bash
   git push origin fitur-sheva
   ```

---

## 🔄 4. Membuat Pull Request (PR)

Setelah push berhasil:

1. Buka repo di GitHub.
2. Akan muncul tombol hijau **“Compare & pull request”**.
3. Klik tombol tersebut → isi deskripsi PR (misalnya “Menambahkan fitur login”).
4. Pastikan:
   - **base branch:** `main`
   - **compare branch:** `fitur-sheva`
5. Klik **Create Pull Request**.

---

## 🔍 5. Review & Merge Pull Request

1. **Leader** membuka tab **Pull requests**.
2. Review perubahan (lihat diff file).
3. Jika sudah benar, klik:
   - ✅ *Merge pull request* → untuk gabungkan langsung.
4. Setelah merge:
   - `main` kini berisi fitur terbaru dari branch tersebut.
   - Branch `fitur-sheva` bisa dihapus jika sudah tidak diperlukan.

---

## ⚠️ 6. Menghindari & Menangani Merge Conflict

Merge conflict terjadi jika dua branch mengubah baris kode yang sama.

💡 **Solusi:**
1. Sebelum membuat PR, selalu update branch dengan isi terbaru dari `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout fitur-sheva
   git merge main
   ```
2. Jika muncul conflict, buka file yang ditandai:
   ```
   <<<<<<< HEAD
   versi di branch kamu
   =======
   versi di main
   >>>>>>> main
   ```
   Pilih versi yang benar, hapus tanda tersebut, lalu:
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   git push
   ```

---

## 🔄 7. Update Semua Anggota Setelah Merge

Setiap kali `main` berubah:
```bash
git checkout main
git pull origin main
```
Tujuannya agar semua anggota bekerja dengan versi kode terbaru.

---

## 🧹 8. Membersihkan Branch yang Sudah Selesai

Setelah merge ke main:
```bash
git branch -d fitur-sheva
git push origin --delete fitur-sheva
```
Ini menjaga repo tetap bersih dan mudah dikelola.

---

## 📊 9. Ringkasan Alur Kolaborasi

| Langkah | Penjelasan | Command Utama |
|----------|-------------|----------------|
| 1 | Clone repo utama | `git clone` |
| 2 | Buat branch fitur | `git checkout -b fitur-x` |
| 3 | Commit dan push | `git add .`, `git commit`, `git push` |
| 4 | Buat Pull Request | via GitHub |
| 5 | Review & Merge | via GitHub |
| 6 | Update branch lokal | `git pull origin main` |
| 7 | Hapus branch selesai | `git branch -d` |

---

> **Catatan:** Setelah semua fitur di-merge ke `main`, pastikan seluruh anggota melakukan `git pull origin main` agar proyek tetap sinkron dan tidak ada perbedaan versi antar anggota.
