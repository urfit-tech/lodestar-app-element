# Lodestar App Element

## Craft.js

> every changes will break the application
> we have to do our best not to revise the interface

## Element Component

each component should be `ElementComponent` so that it can be converted to Craft Element.
To convert to Craft element, simply use:

```ts
Craftize(ElementComponent)
```

for an element component, you will get the following props:

1. className: after crafting, you will get the styled className
2. loading: you will get partial props for loading
3. errors: you will get partial props for errors
4. editing: craft editor state
5. other props you set

### Why do we keep loading/errors/data at once?

when the state changed into loading, the data/error state should still exist.
also, when the state changed into error, the original UI should be kept.

## Context Collection

### Why do we use context?

1. Custom hook: not suitable for development
2. useState: not suitable for graphql
3. Conditional render: not suitable for flexible UI component
   we focus on data processing instead of passing through annoying arguments
