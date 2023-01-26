export declare function useCheckbox<P>(items: CheckboxHookBase<P>[]): [CheckboxHook<P>];

// since we ARENT providing the user the ability to explicity modify setState, ALL crud actions need to be implemented 

export declare class CheckboxHook<P> {
    public readonly items: Checkbox<P>[];

    constructor(items: Item<P>[]);

    public createHook(items: CheckboxHookBase<P>[]): void;
    public setItems(items: Item<P>[]): void;
    public addItem(item: ItemBase<P>): void;
    public getSelectedItems(): Item<P>[];
    public selectAll(): void;
    public isIndeterminate(): boolean;
    public isAllSelected(): boolean;
    public isAnySelected(): boolean;
}

export declare class Checkbox<P> extends CheckboxHook<P>{
    public readonly name: string;
    public readonly isSelected: boolean;
    public readonly properties: P;
    public readonly id: number;

    constructor(name: string, isSelected: boolean, properties: P, id: number);

    public setSelected(selected: boolean): void;
    public setProperties(properties: I): void;
    public setItemName(name: string): void;
    public removeItem(): void;
    public select(): void;
}

export interface CheckboxHookBase<P> extends ItemBase<P> {
    name: string;
    isSelected?: boolean;
    properties?: I;
    id?: number;
    options?: CheckboxHookBase<P>[];
}
