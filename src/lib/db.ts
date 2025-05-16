import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import path from 'path';
import fs from 'fs';

//connecting db
export async function OpenDB(){
    const dbDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'userdb.db');
    
    return open({ filename: dbPath,driver: sqlite3.Database})
}