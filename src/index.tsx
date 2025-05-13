import {
  Item,
  ItemParams,
  Menu, MenuAnimation, RightSlot,
  Separator,
  Submenu, Theme, TriggerEvent, useContextMenu,
} from "react-contexify";
import {createContext, forwardRef, ReactNode, useContext, useImperativeHandle, useRef, useState} from "react";
import * as React from "react";

const GLOBAL_CONTEXT_MENU_ID = "Unique-ID-Global-Context-Menu";


interface ContextMenuAction {
  iconClass?: string,
  icon?: React.ReactNode,
  label: string;
  title?: string;
  disabled?: boolean;
  hidden?: boolean;
  closeOnClick?: boolean;
  action?: (e?: ItemParams) => void;
  checked?: boolean;
  style?: React.CSSProperties;
  data?: Record<string, unknown>,
}

interface ContextMenuWithId {
  iconClass?: string,
  icon?: React.ReactNode,
  id?: string;
  label: string;
  title?: string;
  disabled?: boolean;
  hidden?: boolean;
  closeOnClick?: boolean;
  checked?: boolean;
  style?: React.CSSProperties;
  data?: Record<string, unknown>,
}

interface ContextMenuSubmenu {
  iconClass?: string,
  icon?: React.ReactNode,
  label: string;
  title?: string;
  items: ContextMenuItem[];
  arrow?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  style?: React.CSSProperties;
}

interface ContextMenuSeparator {
  separator: true;
}

export type ContextMenuItem = ContextMenuAction | ContextMenuWithId | ContextMenuSubmenu | ContextMenuSeparator;
export type ContextMenuItems = ContextMenuItem[];

// ********************************************
//  LeftSlot and LeftSlotProps

type LeftSlotProps = {
  children?: React.ReactNode;
  width?: number; // optional customization
};

const LeftSlot: React.FC<LeftSlotProps> = ({ children, width = 20 }) => {
  return (
      <span
          style={{
            display: 'inline-flex',
            width,
            minWidth: width,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '8px', // spacing between icon and text
          }}
      >
      {children || null}
    </span>
  );
};


// ********************************************
//  UncheckedSquareIcon and CheckedSquareIcon
const SVGCheckboxSize = 18;

const UncheckedSquareIcon = () => (
    <svg
        width={SVGCheckboxSize}
        height={SVGCheckboxSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ marginRight: '0px', verticalAlign: 'middle' }}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    </svg>
);

const CheckedSquareIcon = () => (
    <svg
        width={SVGCheckboxSize}
        height={SVGCheckboxSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ marginRight: '0px', verticalAlign: 'middle' }}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <polyline points="6 12 10 16 18 8" />
    </svg>
);

// ********************************************
//  RenderJSONMenu and RenderJSONMenuProps
interface RenderJSONMenuProps {
  items: ContextMenuItems;
  onClick?: (p: ItemParams) => void;
  iconProviderFunction?: (iconClass?: string) => React.ReactNode;
}

const RenderJSONMenu: React.FC<RenderJSONMenuProps> = (props: RenderJSONMenuProps)   => {
  const {items, onClick} = props;
  // Determine type
  const getContextMenuItemType = (item: ContextMenuItem): 'action_with_id' | 'action' | 'submenu' | 'separator' | `unknown` => {
    if ('separator' in item) {
      return 'separator';
    } else if ('items' in item) {
      return 'submenu';
    } else if ('id' in item) {
      return 'action_with_id';
    } else if ('action' in item) {
      return 'action';
    } else {
      return "unknown";
    }
  }

  const renderIcon = (s?:string) => {
    if (typeof props.iconProviderFunction === "function") return props.iconProviderFunction(s); else return (<></>);
  }

  return (
      <>
        {items.filter(i => getContextMenuItemType(i) !== "unknown").map((item, index) => {
          const type = getContextMenuItemType(item);
          switch (type) {
            case "action_with_id": {
              const itemWithId = item as ContextMenuWithId;
              return (
                  <Item id={itemWithId.id} closeOnClick={itemWithId.closeOnClick}
                        disabled={itemWithId.disabled}
                        hidden={itemWithId.hidden}
                        onClick={(e: any) => {
                          if (typeof onClick === "function") onClick(e)
                        }}
                        title={itemWithId.title}
                        key={index}
                        style={itemWithId.style}
                        data={itemWithId.data}
                  >
                    {itemWithId.iconClass ?
                        <LeftSlot>{renderIcon(itemWithId.iconClass)}</LeftSlot> :
                        <LeftSlot>{itemWithId.icon}</LeftSlot>
                    }
                    {itemWithId.label}
                    {typeof itemWithId.checked !== "undefined" &&
                        <RightSlot style={{color: "inherit"}}>
                          {itemWithId.checked ? <CheckedSquareIcon/> : <UncheckedSquareIcon/>}
                        </RightSlot>}
                  </Item>)
            }
            case "action": {
              const itemAsAction = item as ContextMenuAction;
              return (
                  <Item closeOnClick={itemAsAction.closeOnClick}
                        disabled={itemAsAction.disabled}
                        hidden={itemAsAction.hidden}
                        onClick={(e: any) => {
                          if (typeof itemAsAction.action === "function") itemAsAction.action(e);
                        }}
                        title={itemAsAction.title}
                        key={index}
                        style={itemAsAction.style}
                        data={itemAsAction.data}
                  >
                    {itemAsAction.iconClass ?
                        <LeftSlot>{renderIcon(itemAsAction.iconClass)}</LeftSlot> :
                        <LeftSlot>{itemAsAction.icon}</LeftSlot>
                    }
                    {itemAsAction.label}
                    {typeof itemAsAction.checked !== "undefined" &&
                        <RightSlot style={{color: "inherit"}}>
                          {itemAsAction.checked ? <CheckedSquareIcon/> : <UncheckedSquareIcon/>}
                        </RightSlot>}
                  </Item>)
            }
            case "separator":
              return <Separator key={index}/>
            case "submenu": {
              const itemAsSubMenu = item as ContextMenuSubmenu;
              return (
                  // @ts-ignore
                  <Submenu label={(
                      <div>
                        {itemAsSubMenu.iconClass ?
                            <LeftSlot>{renderIcon(itemAsSubMenu.iconClass)}</LeftSlot> :
                            <LeftSlot>{itemAsSubMenu.icon}</LeftSlot>
                        }
                        <span>{itemAsSubMenu.label}</span>
                      </div>
                  )} title={itemAsSubMenu.title}
                           disabled={itemAsSubMenu.disabled}
                           hidden={itemAsSubMenu.hidden}
                           key={index}
                           style={itemAsSubMenu.style}
                  >
                    {<RenderJSONMenu items={itemAsSubMenu.items} onClick={onClick}
                                     iconProviderFunction={props.iconProviderFunction}/>}
                  </Submenu>)
            }
            default:
              return <></>
          }
        })
        }
      </>
  );
}


// ********************************************
//  JSONContextMenu and JSONContextMenuProps

interface JSONContextMenuProps {
  iconProviderFunction?: (iconClass?: string) => React.ReactNode;
  onClick?: (p: ItemParams) => void;
  /**
   * Theme is appended to `contexify_theme-${given theme}`.
   *
   * Built-in theme are `light` and `dark`
   */
  theme?: Theme;
  /**
   * Animation is appended to
   * - `.contexify_willEnter-${given animation}`
   * - `.contexify_willLeave-${given animation}`
   *
   * - To disable all animations you can pass `false`
   * - To disable only the enter or the exit animation you can provide an object `{enter: false, exit: 'exitAnimation'}`
   *
   * - default is set to `fade`
   */
  animation?: MenuAnimation;
  /**
   * Disables menu repositioning if outside screen.
   * This may be neeeded in some cases when using custom position.
   */
  disableBoundariesCheck?: boolean;
  /**
   * Prevents scrolling the window on when typing. Defaults to true.
   */
  preventDefaultOnKeydown?: boolean;
  /**
   * Used to track menu visibility
   */
  onVisibilityChange?: (isVisible: boolean) => void;
}

// Define the methods to expose
interface ShowOptions {
  event?: React.MouseEvent<HTMLElement, MouseEvent>;
  position?: { x: number, y: number },
  props?: Record<string, unknown>,
  items: ContextMenuItems;
}
export interface JSONContextMenuRef {
  showMenu: (options: ShowOptions) => void;
  hideMenus: () => void;
}

// @ts-ignore
const JSONContextMenuInternal = forwardRef<JSONContextMenuRef, JSONContextMenuProps>((props: JSONContextMenuProps, ref: JSONContextMenuRef) => {
  const { show, hideAll } = useContextMenu({
    id: GLOBAL_CONTEXT_MENU_ID,
  });
  const {items, setItems} = useContext(JSONContextMenuContext);


  // @ts-ignore
  useImperativeHandle(ref, () => ({
    showMenu: (options: ShowOptions) => {
      const event: TriggerEvent = options.event ? options.event as unknown as TriggerEvent: new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: options.position?.x,
        clientY: options.position?.y,
      }) as TriggerEvent;
      setItems(options.items);
      if (options.event) {
        show({
          event,
          position: options.position,
          props: options.props
        })
      } else {
        setTimeout(()=>{
          show({
            event,
            position: options.position,
            props: options.props
          })
        },10);
      }
    },
    hideMenus: () => {
      hideAll();
    }
  }));

  return (
      <Menu id={GLOBAL_CONTEXT_MENU_ID}
            theme={props.theme}
            animation={props.animation}
            disableBoundariesCheck={props.disableBoundariesCheck}
            preventDefaultOnKeydown={props.preventDefaultOnKeydown}
            onVisibilityChange={props.onVisibilityChange}
      >
        <RenderJSONMenu items={items} onClick={props.onClick} iconProviderFunction={props.iconProviderFunction}/>
      </Menu>
  )

});

interface JSONContextMenuContextTypePublic {
  showContextMenu: (options: ShowOptions) => void;
  hideContextMenu: () => void;
};

interface JSONContextMenuContextType extends JSONContextMenuContextTypePublic {
  jsonContextMenu: React.RefObject<JSONContextMenuRef | null>;
  items: ContextMenuItems;
  setItems: React.Dispatch<React.SetStateAction<ContextMenuItems>>;
  showContextMenu: (options: ShowOptions) => void;
  hideContextMenu: () => void;
};

const JSONContextMenuContext = createContext<JSONContextMenuContextType>(undefined!);


export const JSONContextMenu : React.FC<JSONContextMenuProps> = (props: JSONContextMenuProps)=> {
  const {jsonContextMenu} = useContext(JSONContextMenuContext) ;
  return (<JSONContextMenuInternal ref={jsonContextMenu as React.RefObject<JSONContextMenuRef>}
                                   theme={props.theme}
                                   animation={props.animation}
                                   disableBoundariesCheck={props.disableBoundariesCheck}
                                   preventDefaultOnKeydown={props.preventDefaultOnKeydown}
                                   onVisibilityChange={props.onVisibilityChange}
                                   iconProviderFunction={props.iconProviderFunction}
  />)
}

type JSONContextMenuProviderProps = {
  children: ReactNode;
};

export const JSONContextMenuProvider: React.FC<JSONContextMenuProviderProps> = ({ children }: JSONContextMenuProviderProps) => {
  const jsonContextMenu = useRef(null as JSONContextMenuRef | null);
  const [items, setItems] = useState<ContextMenuItems>([])

  const showContextMenu = (options: ShowOptions) => {
    if (jsonContextMenu.current) jsonContextMenu.current?.showMenu(options);
  }

  const hideContextMenu = () => {
    if (jsonContextMenu.current) jsonContextMenu.current?.hideMenus();
  }

  return (
      <JSONContextMenuContext.Provider value={{ jsonContextMenu, items, setItems, showContextMenu, hideContextMenu }}>
        {children}
      </JSONContextMenuContext.Provider>
  );
};

export const useJSONContextMenu = () => {
  return useContext(JSONContextMenuContext) as  JSONContextMenuContextTypePublic;
};

