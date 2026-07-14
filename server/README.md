run database in macos

mongod --dbpath /Users/mohammad/db/kar_refah_db --port 27021

---

run database in windows

mongod --dbpath "C:\Users\Caspian Team\Desktop\kar_refah_nodejs_reactjs_ts\kar_refah_db" --port 27021

---

backup

$folder = "C:\backups\mongodump-" + (Get-Date -Format "yyyy-MM-dd")

> > mongodump --host 127.0.0.1 --port 27017 --out $folder

---

restore

$folder = "C:\backups\mongodump-2025-10-05"

> > mongorestore --host 127.0.0.1 --port 27017 $folder

mongorestore --host 127.0.0.1 --port 27017 --nsFrom="test._" --nsTo="radmehr._" --dir="C:\backups\mongodump-2025-10-05"

$backupFile = "C:\backups\mydb-" + (Get-Date -Format "yyyy-MM-dd") + ".gz"
mongodump --host 127.0.0.1 --port 27017 --archive=$backupFile --gzip

$backupFile = "C:\backups\radmehr-" + (Get-Date -Format "yyyy-MM-dd") + ".gz"

> > mongodump --host 127.0.0.1 --port 27017 --db=radmehr --archive=$backupFile --gzip

$backupFile = "C:\backups\kar_refah-" + (Get-Date -Format "yyyy-MM-dd") + ".gz"
mongodump --uri="mongodb://root:1QRlGIfZWdzmTRggEUPhccai@chogolisa.liara.cloud:33971/my-app?authSource=admin" --archive=$backupFile --gzip

mongodump \
 --uri="mongodb://127.0.0.1:27017/kar_refah" \
 --archive="/Users/mohammad/backups/kar_refah/kar_refah-$(date +%F).gz" \
 --gzip

mongorestore \
 --uri="mongodb+srv://kar_refah:UM8jU0zGZt1gzSnb@cluster0.ldtywmi.mongodb.net/kar_refah" \
 --archive="/Users/mohammad/backups/kar_refah/kar_refah-2025-10-07.gz" \
 --gzip


for backup database
mongodump --uri="mongodb://admin:Mm%40123456@192.168.100.5:27017/kar_refah?authSource=admin" --archive="C:\backups\kar_refah\kar_refah-2026-06-06.gz" --gzip

for replace new database on old database
mongorestore --uri="mongodb://admin:Mm%40123456@192.168.100.5:27017/kar_refah?authSource=admin" --archive="C:\backups\kar_refah\kar_refah-2026-06-06.gz" --gzip

for change database name
mongorestore --uri="mongodb://127.0.0.1:27017" --archive="/kar_refah/kar_refah_20_09_1404/kar_refah-2025-12-10.gz" --gzip --nsFrom="kar_refah._" --nsTo="kar_refah_20_09_1404._"
↑↑↑↑↑↑↑↑↑↑↑↑
mongorestore --uri="mongodb://admin:Mm%40123456@192.168.100.5:27017" --archive="C:\backups\kar_refah\kar_refah-2026-05-16.gz" --gzip --nsFrom="kar_refah_20_09_1404.*" --nsTo="kar_refah.*" --stopOnError



mongorestore --uri="mongodb://localhost:27017/kar_refah" --archive="./kar_refah-2026-06-06.gz" --gzip