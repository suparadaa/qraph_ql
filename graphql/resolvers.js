const { sql } = require("../data/connectDatabase");

const resolvers = {
  getAllData: async (_, args) => {
    try {
      const pool = await sql.connect(); // เชื่อมต่อฐานข้อมูล
      const result = await pool
        .request()
        .input("page", sql.Int, args.page || 1)
        .input("limit", sql.Int, args.limit || 10)
        .query(`
          SELECT id, unit, time, value, create_at_bi
          FROM idc_btt
          ORDER BY create_at_bi DESC
          OFFSET (@page - 1) * @limit ROWS
          FETCH NEXT @limit ROWS ONLY;
        `);

      const countResult = await pool
        .request()
        .query("SELECT COUNT(*) AS total FROM idc_btt");

      const totalData = countResult.recordset[0].total;
      const totalPages = Math.ceil(totalData / args.limit);

      return {
        totalData,
        totalPages,
        currentPage: args.page,
        data: result.recordset,
      };
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      throw new Error("Database query failed");
    }
  },
};

module.exports = resolvers;
