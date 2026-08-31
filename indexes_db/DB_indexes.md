# Database Indexes

## Indexing in database

indexing is a data structure that apply on database tables to make a faster search
it uses balanced binary search tree
insertion,updating,deletion takes log(n) 

we can apply on speicific  rows

with out index db : full table scan i.e linear search
with index : do index scan which is more faster

side effects : but it takes more space and some hits (very less)



# Types of indexes

- Hash based : hash based algo take hash of cols -> hash storage
- Tree based
    - LSM (no sql databases)
    - B Tree based on the  Modified M way tree


# Composite Index
- A composite Index is a making an index more than one column
- left most prefix : activates index scan (not always)

# Intresting Things on Indexing

- Even some times it may not use index scan due to query planner ex: select * from products where price >= 1000000 query plan decides  knows that we need  a full scan as even though we have index on price
- Depends highly on query and db query planner all these factors plays a role while deciding 
- use **Explain** command to test scenarios to find what scan db pick for the query
- **keep the above things in mind then decide on query to optimize at backend + db  level**
- some times db  can do query on indexed scan result as that apply filter on that indexing result will contains  what we needed without touching db **Index Condition Pushdown (ICP)**
