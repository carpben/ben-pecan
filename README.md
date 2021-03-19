# Ben's Assignment to Pecan

## API

We provide an endpoint to get children of each database entity. The endpoint "database" receives path parameters in the following structure.

```js
/database/{connection}/{database}/{schema}/{table}
```

It returns data in the following structure:

```ts
interface DataResponse {
	success: boolean
	message?: string // if request failed due to invalid path
	children?: Record<string, NodeBranch>
}

export type NodeBranch = {
	name: string
	type: string
	canAccess: boolean
}
```

The value `canAcess` depends on the permissions of the logged in user.

### Considerations

API user must provide a path to a database enetity. This could be done either in using path parameters or using query parameters. We choose to use path parameters because Query parameters such as

```ts
interface Parameters {
	connection?: string
	database?: string
	schema?: string
	table?: string
}
```

are prone to an invalid path structure. For example, the user might provide connection name and table name without the database and schema names.

## Implement feature based on the above API design

### Mock

To implement the app based on the above API, we modcked the API endpoint. Mock code is located in `src/api` folder. The function `getNode` at `mock.ts` emulates the `database` endpoint by receiveing an array to the path instead of path parameters.
**Notes**

-  Preparing the mock was actually the bigger part of the challenge.
-  Tests were written in `mock.test.ts`
-  Number of of children and logic permission to entity could be configured in `mockConfig.ts`

### App

According to the requirements we need to render a tree (Similar in a way to a folder explorer), in which any node can be opened, and the primitive node is `column`.
App was written using `Create React App 4`. Logic is held in the top App component. NodeComponent is a recursive component, that can render itself as a child. Since we might need to render large lists, to avoid unncessary renders of the entire list when just one node opens or closes we use `React.memo`.

**Known issues**

-  We used inline css in js for styling. Moving styles out of the component render function can yield cleaner code.
-  Node children is requested every time it is opened, even if it was requested before. Going further we can prevent unnecessary requests.

## Big amounts of items

Big amounts of items can result in a slow user experience. The main causes are:

-  more data means that the network request will take longer.
-  More data means a longer list to render.
   Solutions:
-  The user can only view a certain amount of data on his screen. Therefore we can only fetch the relevant data that should be shown on the screen. The user can then indicate if he wants to view a different range in the list. For example, we can show results `1-100`, and then provide a button `100+` to request the next page in the list.
-  We already use React.memo to prevent unnecessary renders. However, if a long list in the dom is a burden on the browser's performance we can use virtualization (a library such as React Virtualize) to only render the parts of the list that should be shown on the screen.

## Adding and removing items

The endpoint `database` (that is described above) requires an `action` query parameters:

```ts
interface DatabaseQueryParameters {
	action: "view" | "add" | "delete"
	childName?: string
}
```

It will return `DataResponse`.

Following are examples for http requests, their action and their response (assuming a valid request).

```js
/database/connection5/5database5/schema5/table5?action=view
```

action: None
response: `SuccessfulDataResponse` where children are the children of `table5`

```ts
interface SuccessfulDataResponse {
	success: true
	children: Record<string, NodeBranch> // updated version of the node's children
}
```

```js
/database/connection5/database5/schema5/table5?action=add&childName=column101
```

action: Adds column `column101` to `table5`.
response: `SuccessfulDataResponse` where children is an updated version of the children of the parent table.

```js
/database/connection5/5database5/schema5/table5?action=delete&childName=column101
```

action: Deletes column `column101` from `table5`.
response: `SuccessfulDataResponse` where children is an updated version of the children of the parent table.
