const { GraphQLError } = require('graphql');
const sql = require('mssql'); // ตรวจสอบให้แน่ใจว่ามีการ import sql

const resolvers = {
  getAllData: async (_, args, { res }) => {
    try {
      const page = args.page;
      const limit = args.limit;

      // ตรวจสอบค่าของ page และ limit
      if (!page || page < 1) {
        res.status(400); // ⬅️ ตั้งค่า HTTP Status 400
        throw new GraphQLError("Invalid input: 'page' must be greater than 0.", {
          extensions: { code: "BAD_REQUEST" }
        });
      }
      if (!limit || limit < 1) {
        res.status(400); // ⬅️ ตั้งค่า HTTP Status 400
        throw new GraphQLError("Invalid input: 'limit' must be a positive number greater than 0.", {
          extensions: { code: "BAD_REQUEST" }
        });
      }

      const pool = await sql.connect();
      const countResult = await pool.request().query("SELECT COUNT(*) AS total FROM idc_btt");
      const totalData = countResult.recordset[0].total;
      const totalPages = Math.ceil(totalData / limit);

      if (page > totalPages) {
        res.status(400); // ⬅️ ตั้งค่า HTTP Status 400
        throw new GraphQLError(`Invalid page: Page ${page} exceeds total pages (${totalPages}).`, {
          extensions: { code: "BAD_REQUEST" }
        });
      }

      const result = await pool
        .request()
        .input("page", sql.Int, page)
        .input("limit", sql.Int, limit)
        .query(`
          SELECT id, unit, time, value, create_at_bi
          FROM idc_btt
          ORDER BY create_at_bi DESC
          OFFSET (@page - 1) * @limit ROWS
          FETCH NEXT @limit ROWS ONLY;
        `);

      return {
        totalData,
        totalPages,
        currentPage: page,
        data: result.recordset,
      };

    } catch (err) {
      console.error("❌ Error fetching data:", err);

      if (!err.extensions) {
        res.status(500);
      }

      throw new GraphQLError(err.message, {
        extensions: { code: err.extensions?.code || "INTERNAL_SERVER_ERROR" }
      });
    }
  },

  getDataByvalue: async (_, args) => {
    try {
      const { value } = args;

      if (!value) throw new GraphQLError("Invalid input: 'value' is required.");
      const numericValue = parseFloat(value);

      const pool = await sql.connect();
      const result = await pool
        .request()
        .input("value", sql.Float, numericValue)
        .query("SELECT id, unit, time, value, create_at_bi FROM idc_btt WHERE value = @value;");

      if (result.recordset.length === 0) {
        throw new GraphQLError(`No data found for id: ${value}`);
      }

      return result.recordset;
    } catch (err) {
      console.error("❌ Error fetching data by ID:", err);
      throw new GraphQLError(err.message);
    }
  },
};

module.exports = resolvers;
