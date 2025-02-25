const sql = require("mssql");

const config = {
    user: "sa",            // ชื่อผู้ใช้ SQL Server
    password: "Suparada01", // รหัสผ่าน
    server: "localhost",    // ชื่อเซิร์ฟเวอร์หรือ IP
    port: 1433,             // พอร์ต SQL Server
    database: "master",     // ชื่อฐานข้อมูล
    options: {
        encrypt: false,               // ใช้ `true` ถ้าเป็น Azure SQL
        trustServerCertificate: true  // ใช้ `true` ถ้าเป็น Localhost
    }
};

async function connectDB() {
    try {
      await sql.connect(config);
      console.log("✅ Connected to SQL Server");
    } catch (err) {
      console.error("❌ Database Connection Failed: ", err);
    }
  }
  
  module.exports = { connectDB, sql };

/*
// สร้าง Connection Pool
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("✅ Connected to SQL Server");
        return pool;
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err);
    });

module.exports = {
    sql, poolPromise
};*/
