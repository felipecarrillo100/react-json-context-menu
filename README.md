# react-json-context-menu
A React Typescript class component to facilitate the integration of newer versions of react-contexify with my existing applications

## How to install:
npm install react-json-context-menu react-contexify

## How to include
Import code
```Typescript 
import {JSONContextMenuProvider} from "react-json-context-menu";
```
Import styles directly from `react-contexify` library:
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
### Create elements the React way
Create an context menu in your App:
```javascript
    <JSONContextMenu theme="dark" iconProviderFunction={iconProviderFunction}/>
```  

Use the hook to open a context menu from any component
```Typescript
const {showContextMenu} = useJSONContextMenu();

const handleContextMenu = (event:  React.MouseEventHandler<HTMLElement>) => {
    const menuItems: ContextMenuItems = [
        { label: 'Option 1', title: 'Option 1', action: () => console.log('Option 1 selected'), disabled: true },
        { separator: true },
        { label: 'Option 2', title: 'Option 2', action: () => console.log('Option 2 selected') }
    ];
    showContextMenu({event, items: menuItems})
};
```
Now wire your React components
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

Small sample here: https://codesandbox.io/p/sandbox/test-react-json-context-menu-hvq7nx
