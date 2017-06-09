# nsql

Stream data directly from sql instead of waiting for buffering.   
All output is JSON formatted.   

Stream data into sql table.   
Input should be newline delimited JSON.    

## Installation
```bash
  npm install -g node-sql-stream    
  # Client of choice (mysql, pg)    
  npm install -g [client]
```

## Usage
```bash
  nsql client://user:password@host:port/db 'select * from test;' > data   
  <data nsql client://user:password@host:port/db/table
```
