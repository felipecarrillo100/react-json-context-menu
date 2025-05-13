# react-json-context-menu
A React Typescript class component to facilitate the integration of newer versions of react-contexify with my existing applications

## Use case
The react-contexify library is an excellent library designed for displaying context menus. However, it can be inconvenient to create a menu from React component every I need a new Context Menu. 
For my purposes, it is far more convenient to define a menu using a JSON object, allowing me to easily call and display the context menu from anywhere.  

Menus are defined as an array of items, for instance:
```TypeScript
    [
        { label: 'Option 1', title: 'Option 1', action: () => console.log('Option 1 selected'), disabled: true },
        { separator: true },
        { label: 'Option 2', title: 'Option 2', action: () => console.log('Option 2 selected') }
    ]
```

## How to install:
npm install react-json-context-menu react-contexify

## How to include
Import code
```Typescript 
import {JSONContextMenuProvider} from "react-json-context-menu";
```
Import the styles directly from `react-contexify` library:
```
import 'react-contexify/ReactContexify.css';
```
## To use
### Add the `JSONContextMenuProvider` wrapping your app
```Typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <JSONContextMenuProvider>
            <App />
      </JSONContextMenuProvider>
  </StrictMode>
)

```
### Create your menu by simply adding the component at the end of your App
Create a context-menu in your App:
```javascript
    <JSONContextMenu theme="dark" />
```  

Use the hook to open a context menu from any component
```Typescript
// Import type and hook
import {type ContextMenuItems, useJSONContextMenu} from "react-json-context-menu";

// Use Hook to gain access to `showContextMenu`

const {showContextMenu} = useJSONContextMenu();

const handleContextMenu = (event:  React.MouseEventHandler<HTMLElement>) => {
    // Define your menu as a JSON object
    const menuItems: ContextMenuItems = [
        { label: 'Option 1', title: 'Option 1', action: () => console.log('Option 1 selected'), disabled: true },
        { separator: true },
        { label: 'Option 2', title: 'Option 2', action: () => console.log('Option 2 selected') }
    ];
    // Open your menu on response to an event
    showContextMenu({event, items: menuItems})
};
```
Now wire your React components, to mouse events onClick or onContextMenu 
```javascript
<div>
    <button onClick={(event) => handleContextMenu(event)}>
        Context Menu
    </button>
    <button onContextMenu={handleContextMenu}>
        Context Menu Right Click
    </button>
</div>
```  

### Open ContextMenu without event 
If you want to trigger opening the Context Menu but you don't have an event you can, but you need to provide the position to display the Context Menu as `position`
```javascript
const openMenuWithOutEvent = (x: number, y: number) => {
    // Define your menu as a JSON object
    const menuItems: ContextMenuItems = [
        { label: 'Option 1', title: 'Option 1', action: () => console.log('Option 1 selected'), disabled: true },
        { separator: true },
        { label: 'Option 2', title: 'Option 2', action: () => console.log('Option 2 selected') }
    ];
    // Open your menu on response to an event
    showContextMenu({position: {x, y}, items: menuItems})
};
```  

Small sample here: https://codesandbox.io/p/sandbox/test-react-json-context-menu-hvq7nx
