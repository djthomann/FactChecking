import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

export type OptionsMenuItem = {
    label: string;
    icon?: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    confirm?: string;
};

type Props = {
    items: OptionsMenuItem[];
    ariaLabel?: string;
};

function OptionsMenu({ items, ariaLabel = "Options" }: Props) {
    if (items.length === 0) return null;

    return (
        <UncontrolledDropdown>
            <DropdownToggle
                color="link"
                size="sm"
                className="px-2 py-1 text-muted"
                aria-label={ariaLabel}
            >
                <i className="bi bi-three-dots-vertical"></i>
            </DropdownToggle>
            <DropdownMenu end>
                {items.map((item) => (
                    <DropdownItem
                        key={item.label}
                        className={item.danger ? "text-danger" : undefined}
                        disabled={item.disabled}
                        onClick={() => {
                            if (item.confirm && !window.confirm(item.confirm)) return;
                            item.onClick();
                        }}
                    >
                        {item.icon && <i className={`bi ${item.icon} me-2`}></i>}
                        {item.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}

export default OptionsMenu;