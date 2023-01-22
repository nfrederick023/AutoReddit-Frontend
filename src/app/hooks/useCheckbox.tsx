import { Updater, useImmer } from 'use-immer';
import { WritableDraft } from 'immer/dist/internal';
import { castDraft } from 'immer';

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = <T,>(initialItems: SelectItemsBase<T>[]): [SelectUtility<T>] => {
    const [state, setState] = useImmer<SelectUtility<T> | undefined>(undefined);
    const selectItems = createSelectItemsArr<T>(initialItems);
    setState((draft) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        draft = castDraft(new SelectUtility(selectItems, setState as Updater<SelectUtility<T>>));
    });
    return [state as SelectUtility<T>];
};

const createSelectItemsArr = <T,>(items: SelectItemsBase<T>[]): SelectItems<T>[] => {
    return items.map(item => new SelectItems<T>(item));
};

export interface SelectItemsBase<T> {
    name: string,
    sectionNames?: string[],
    isSelected?: boolean,
    properties?: T
}

export class SelectItems<T> {
    public readonly name: string;
    public readonly sectionNames: string[];
    public readonly isSelected: boolean;
    public readonly properties: T;

    constructor(item: SelectItemsBase<T>) {
        this.name = item.name,
            this.sectionNames = item.sectionNames ?? ['unnamed_section'],
            this.isSelected = item.isSelected ?? false,
            this.properties = item.properties as T;
    }
}

export class Item<T>{
    public readonly name: string;
    public readonly isSelected: boolean;
    public readonly properties: T;
    private readonly sectionName: string;
    private readonly setState: Updater<SelectUtility<T>>;

    public constructor(item: SelectItems<T>, sectionName: string, setState: Updater<SelectUtility<T>>) {
        this.properties = item.properties;
        this.isSelected = item.isSelected;
        this.name = item.name;
        this.sectionName = sectionName;
        this.setState = setState;
    }

    private getDraftItem = (draft: WritableDraft<SelectUtility<T>>): WritableDraft<Item<T>> | undefined => {
        return draft.sections.find(section => section.name === this.sectionName)?.items.find(item => item.name === this.name);
    };

    public selectItem = (): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const item = this.getDraftItem(draft);
            if (item)
                item.isSelected = !item.isSelected;
        });
    };

    public setIsSelected = (isSelected: boolean): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const item = this.getDraftItem(draft);
            if (item)
                item.isSelected = isSelected;
        });
    };

    public setName = (name: string): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const item = this.getDraftItem(draft);
            if (item)
                item.name = name;
        });
    };

    public setProperties = (properties: T): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const item = this.getDraftItem(draft);
            if (item)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                item.properties = castDraft(properties);
        });
    };
}

export class Section<T> {
    public readonly name: string;
    public readonly items: Item<T>[];
    private readonly setState: Updater<SelectUtility<T>>;

    public constructor(items: SelectItems<T>[], name: string, setState: Updater<SelectUtility<T>>) {
        this.setState = setState;
        this.name = name;
        this.items = items.map((item): Item<T> => { return new Item(item, name, setState); });
        this.setState = setState;
    }

    // Functions
    private getDraftSection = (draft: WritableDraft<SelectUtility<T>>): WritableDraft<Section<T>> | undefined => {
        return draft.sections.find(section => section.name === this.name);
    };

    public isIndeterminate = (): boolean => {
        if (this.isAllSelected())
            return false;

        return this.items.some(item => item.isSelected);
    };

    public isAllSelected = (): boolean => {
        return !this.items.filter(item => !item.isSelected).length;
    };

    public isAnySelected = (): boolean => {
        return this.isIndeterminate() || this.isAllSelected();
    };

    public selectAll = (): void => {
        const isIndeterminate = this.isIndeterminate();
        this.items.forEach((item) => {
            if (isIndeterminate)
                item.setIsSelected(true);
            else
                item.selectItem();
        });
    };

    public getSelectedItems = (): Item<T>[] => {
        return this.items.filter(item => item.isSelected);
    };

    // Setters
    public setName = (name: string): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const section = this.getDraftSection(draft);
            if (section)
                section.name = castDraft(name);
        });
    };

    public setItems = (items: Item<T>[]): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const section = this.getDraftSection(draft);
            if (section)
                section.items = castDraft(items);
        });
    };
}

class SelectUtility<T> {
    public readonly sections: Section<T>[];
    private readonly setState: Updater<SelectUtility<T>>;

    public constructor(items: SelectItems<T>[], setState: Updater<SelectUtility<T>>) {
        this.setState = setState;
        this.sections = this.intializeSections(items);
    }

    // Functions
    private intializeSections = (newItems: SelectItems<T>[]): Section<T>[] => {

        const newSections: Section<T>[] = [];
        newItems.forEach((newItem) => {
            newItem.sectionNames.forEach(sectionName => {
                const sectionInNewState = newSections.find(section => section.name === sectionName);
                const itemInOldState = this.sections.find(section => section.name === sectionName)?.items.find(item => item.name === newItem.name);

                // add new section and new item 
                if (!sectionInNewState) {
                    newSections.push(new Section([newItem], sectionName, this.setState));
                    return;
                }

                // add exsisting item to exsisting section
                if (itemInOldState) {
                    sectionInNewState.items.push(itemInOldState);
                    return;
                }

                // add new item to exsisting state
                if (!itemInOldState) {
                    sectionInNewState.items.push(new Item(newItem, sectionName, this.setState));
                    return;
                }
            });

        });

        return newSections;
    };

    public isAnyItemChecked = (): boolean => {
        return !!this.sections.find(section => section.isAnySelected());
    };

    public getSelectedSections = (): Section<T>[] => {
        return this.sections.filter(section => section.isAnySelected());
    };

    // Setters
    public setUtility = (initialItems: SelectItemsBase<T>[]): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            const selectItems = createSelectItemsArr<T>(initialItems);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            draft = castDraft(new SelectUtility(selectItems, this.setState));
        });
    };

    public setSections = (sections: Section<T>[]): void => {
        this.setState((draft: WritableDraft<SelectUtility<T>>): void => {
            draft.sections = castDraft(sections);
        });
    };
}

