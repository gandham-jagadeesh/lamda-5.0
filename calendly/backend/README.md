

## CALENDLY BACKEND


# High Level Design



# API Design

## User API

```JS
userRouter.get("/", getAllUsers);
userRouter.post("/",createUser);
userRouter.delete("/:id",removeUser);
userRouter.get("/:id", getUser);
userRouter.put("/:id", updateUser);

```
