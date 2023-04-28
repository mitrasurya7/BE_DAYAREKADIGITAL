# README


### Pertanyaan
1. Bagaimana Jika terdapat ribuan transaksi pada database ???
Perlu dipikirkan secara lebih matang tentang skema data serta relasi yang dibutuhkan. Untuk saat iniyang paling efisien menggunkan noSql seperti mongoDb, Namun pada project kali ini saya menggunkan mySql karena untuk data yang tidak memerlukan banyak relasi sangat bagus serta mudah untuk dibaca dan data yang ditampilkan lebih rapi.

2. Bagaimana jika terdapat banyak user yang mengakses API tersebut secara bersamaan???
Untuk menangani Hal tersebut saya telah menerapkan Redis.io yang berfungsi untu caching data agar dapat meringankan kerja server sehingga resource server dapat di alokasikan di tempat lain. 

### pada test kali ini saya menyertakan dummy test via postman collection
