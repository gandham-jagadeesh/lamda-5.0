
## DBMS - 1  : Basics of DBMS and introduction to MySQL


### Concepts :

- Traditional storage
	 A file based storage system : don't provide backup , efficient storage , retrieval
- what is database and database management systems?
	 A database is a software which we use to efficiently store and retrieve data
	 Supports different types of data to store ex: numbers ,strings ,images..
	 A database management  systems are software that we interact to use databases
- types of databases
	- SQL databases (RDBM'S)  Ex: MySQL , Pg SQL , MS Server SQL,
	- NOSQL databases Ex:  MongoDB ( document  ) , Redis (key-value ) , Cassandra (column )
   RDBMS supports :
	- query language : specification
	- Acid properties
- How RDBMS stores data
	- Stores in table like format
Operations on DBMS
 - create , delete , see databases and tables in MySQL 
```mysql
	-- create db's and tables
	create database tutorial_db; -- end of statement ;
	create table users;
	
	-- show db's,tables
	show databases;
	show tables;
	
	-- remove db's and tables
	drop database tutorial_db; 
	drop table users;
	
```
- Table : schema to show what fields and their data types we support its not the actual storage

## DBMS - 2 : Queries with MySQL

### Concepts
- insert ,bulk inserts ,  drop , delete table's
- update the data in table 
- querying the table : select , filter : where 
- operators : and ,or ,not ,like
- Ex: user and posts table 
- classifications : DDL , DML , TCL  , DQL

## DBMS -  3  : Joins and Relationships

  ### Concepts

- Truncate is faster than delete
- make sure keep your table is extensible example :  likes table where we having field called Enum having comment, post later in future reels
- alter command to alter table design
 - constraints : not null , unique , primary key
 - relationships
 - joins explained
 - EX: Facebook database : users ,posts ,comments, likes


## DBMS -  4  : Design a Database

### Concepts
- SQL  is a specifications some DBMS may or may not have all of features mentioned in that ex: full joins don't exists in MySQL database.
- Joins : full , inner , left , right  , cross (need to investigate more on the cross join )
- Relationships:
		1 - 1  one to one  ex: one citizen has one Aadhar
	    1 - M one to many ex: one author has many books
	    M - 1 many to one  : many books belongs to one author 
		M - N many to many : physicians ,patients
- Leetcode :  db design : test cases stored in s3 (they are huge) , details of problem statement : markdown format

## DBMS - 5 what db to choose

### Concepts
- Based on team preference pick db 
-  one system can use more than one db's as we may need rbdms for transactions and for non structured we use mongodb
- graph like structure :  neon4j,infinity graph
-  unstructured data schema less  : document based : mongodb
-  want to store key, value based or caching  : Redis (caching), DynamoDB
- geospatial data (uber) : Redis geo , spatial db , firebase geo spatial db
- column based data : Cassandra. 
-  if you are having relation based  , structured : use Rdbms
-  transactions (payment , bookings ) : use Rdbms
-  files , videos ,audios  :  blob storages  : s3



# Transactions in DB | ACID

##  Intro to transactions 
-  A Transactions is a unit of work if it complete then we call it as commit if some of them fails database  rollback and then we call that abort

## commits
- If the every steps executes then we commit or we rollback 
The query syntax 
 ```mysql
   start transaction;
	   ....
	   ....
	commit;
  ```

## Demo in Transactions

- Account table example  discussed in the video
- ex: two tables credit and debit amount among them

## ACID 

- Atomicity : either transaction (logical unit of queries ) goes through or its rollback. partial updates never will happen 
	-  db uses log based recovery
- Consistency : our db makes sure our data moves from valid state to valid state  ex:  foreign keys , constraints these features make db consistency

## Isolation - 1  : 
- isolation  : its a transaction property that solves concurrency transaction issues
 when we are doing parallel transaction  operations on the same resource we must need isolation : levels of isolation and problems with these dirty read , double read phantom ..etc.
 - read wiki article to learn more about this one

## Isolation - 2 :
- Durability 
- if a transaction is completed then our db ensures that we always gonna be like permanently stored to disk even if in terms of crash.


## Transactions Deep Dive

## Concepts

### isolation
- what problems we face if we don't handle concurrency i.e. parallel transactions
- lost update : when two transactions are executing parallelly both doing update we gonna lose one transactions value 
- dirty read : if one of transactions read a row when other transaction modify  the value then we gonna have uncommitted value or inconsistent data
-  non repeatable reads : if transaction's  have a select query twice each given different results  due to  second transaction modify the value we gonna have different values 
- phantom read :  with in the transaction if we have n+1 or n-1 rows even though if we are executing same rows each we are having different rows sizes due to other transaction inserted or deleted more rows then we call that as phantom read

### solution:
- default isolation : if your queries are only read based just then go default  isolation level ex: analytics based queries  
- read commited isolation level : Enable this isolation we solve dirty read problem but other repetable read , phantom read problem still exists  
- repetable reads : enable this solves dirty read + non repetable reads problem but phantom read problem exists
- serializable : it looks like we are  executing only one transaction at a time so   full eliminate conucurrency problem but (high resource intensive )

- there might be many level isolation levels author discussed the mysql speific

#### less resource intensive 
- we can use combination of these above to avoid serialiazble level but still be perfomant
- pessimistic locking + read commited (locks ) : dead lock can occur 
- optimistic locking (versioning ) : contention can occur
- distrubuted cache lock : instead of going through db levels we can stop at backend level 

## cool idea : 
- booking app : instead of having these mechanisams applied at db level apply at earliest level 
- ex: when ever use booking a ticket we have to fill and then go to payment level 
- so apply at these tickets fill details so either if one person already filling the details of a movie ticket or room booking show to other its try again instead of failure at payment level
- it will be good user expereice instead of payment refund

- Future : learn how database able to implement this in future (database internals)
## Articles

- [isolation ](https://en.wikipedia.org/wiki/Isolation_(database_systems)) - need to study
