const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const mysql = require('mysql2');
const db = require('../config/db');

async function write(str, stream){
  return new Promise((res, rej)=>{
    if (!stream.write(str)) stream.once('drain', res); else res();
  });
}

async function run(){
  try{
    const timestamp = new Date().toISOString().replace(/[:.]/g,'-');
    const outPath = `/home/ubuntu/apex_portal_logical_dump_${timestamp}.sql.gz`;
    const gzip = zlib.createGzip({level: zlib.constants.Z_BEST_COMPRESSION});
    const out = fs.createWriteStream(outPath);
    const stream = gzip.pipe(out);

    await write(`-- APEX_PORTAL logical dump ${new Date().toISOString()}\n`, stream);
    await write("SET FOREIGN_KEY_CHECKS=0;\n\n", stream);

    // get table names
    const [tablesRows] = await db.query("SHOW TABLES");
    const tableNames = tablesRows.map(r => Object.values(r)[0]);

    for (const table of tableNames){
      await write(`-- Table: ${table}\n`, stream);
      // SHOW CREATE TABLE
      const [createRows] = await db.query(`SHOW CREATE TABLE \`${table}\``);
      const createStmt = createRows[0]['Create Table'] || createRows[0]['Create View'] || Object.values(createRows[0])[1];
      await write(`DROP TABLE IF EXISTS \`${table}\`;\n`, stream);
      await write(createStmt + `;\n\n`, stream);

      // Fetch rows
      const [rows] = await db.query(`SELECT * FROM \`${table}\``);
      if (!rows.length) continue;

      const cols = Object.keys(rows[0]).map(c=>`\\\`${c}\\\``).join(',');
      // write inserts in batches
      const batchSize = 200;
      for (let i=0;i<rows.length;i+=batchSize){
        const chunk = rows.slice(i,i+batchSize);
        const values = chunk.map(r=>{
          const vals = Object.values(r).map(v=>mysql.escape(v));
          return `(${vals.join(',')})`;
        }).join(',\n');
        await write(`INSERT INTO \`${table}\` (${Object.keys(rows[0]).map(c=>`\`${c}\``).join(',')}) VALUES\n${values};\n`, stream);
      }
      await write('\n', stream);
    }

    await write("SET FOREIGN_KEY_CHECKS=1;\n", stream);
    gzip.end();

    await new Promise((res,rej)=> out.on('close', res));
    console.log('Dump written to', outPath);
    process.exit(0);
  }catch(err){
    console.error('Backup error:', err.message || err);
    process.exit(2);
  }
}

run();
