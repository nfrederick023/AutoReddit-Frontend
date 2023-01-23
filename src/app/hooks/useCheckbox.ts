// react-checkbox-hook
// reach-checkbox

import { WritableDraft } from 'immer/dist/internal';
import { castDraft } from 'immer';
import { useImmerReducer } from 'use-immer';

export interface SelectUtilityBase<P> {
    itemName: string;
    sectionName?: string;
    selected?: boolean;
    properties?: P;
}

export interface Item<P> {
    itemName: string;
    selected: boolean;
    properties: P;
    readonly select: () => void;
    readonly setItemName: (newName: string) => void;
    readonly setProperties: (properties: P) => void;
    readonly setSelected: (selected: boolean) => void;
}

export interface Section<P> {
    sectionName: string;
    items: Item<P>[];
    readonly setItems: (items: Item<P>[]) => void;
    readonly setSectionName: (newName: string) => void;
    readonly selectAll: () => void;
    readonly getSelectedItems: () => Item<P>[];
    readonly isAnySelected: () => boolean;
    readonly isAllSelected: () => boolean;
    readonly isIndeterminate: () => boolean;
}

export interface SelectUtility<P> {
    sections: Section<P>[];
    readonly setSections: (section: Section<P>[]) => void;
    readonly isAnyItemChecked: () => boolean;
    readonly getSelectedSections: () => Section<P>[];
    readonly createNewUtility: (items: SelectUtilityBase<P>[]) => void;
}

export enum Action {
    // item
    Select,
    SetProperties,
    SetItemName,
    SetSelected,

    // section
    SetSectionName,
    SetItems,
    SelectAll,

    // utlity
    SetSections,
    CreateNewUtility
}

export interface SetSectionBase {
    readonly sectionName: string
}

export interface SetItemBase extends SetSectionBase {
    readonly itemName: string
}

// item action params
export interface SetProperties<P> extends SetItemBase {
    readonly properties: P
}

export interface SetItemName extends SetItemBase {
    readonly newName: string
}

export interface SetSelected extends SetItemBase {
    readonly selected: boolean
}

// section action params
export interface SetSectionName extends SetSectionBase {
    readonly newName: string
}

export interface SetItems<P> extends SetSectionBase {
    readonly items: Item<P>[]
}

// utlity
export interface SetSections<P> {
    sections: Section<P>[]
}

export interface CreateNewUtility<P> {
    items: SelectUtilityBase<P>[]
}

export interface ActionType<T extends Action, P> {
    type: T,
    params:
    T extends Action.Select ? SetItemBase :
    T extends Action.SetProperties ? SetProperties<P> :
    T extends Action.SetItemName ? SetItemName :
    T extends Action.SetSelected ? SetSelected :
    T extends Action.SetSectionName ? SetSectionName :
    T extends Action.SetItems ? SetItems<P> :
    T extends Action.SelectAll ? SetSectionBase :
    T extends Action.SetSections ? SetSections<P> :
    T extends Action.CreateNewUtility ? CreateNewUtility<P> : never;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ActionStfy<T extends Action, P> = Record<keyof ActionType<T, P>, ActionType<T, P>[keyof ActionType<T, P>]>;

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = <P = Record<string, never>>(items: SelectUtilityBase<P>[]): [SelectUtility<P>] => {

    let globalSelectUtility: SelectUtility<P> | undefined = undefined;

    const findSectionInState = (sectionName: string): Section<P> | undefined => {
        return state.sections.find(section => section.sectionName === sectionName);
    };

    // item actions
    const select = (sectionName: string, itemName: string): () => void => {
        const type = Action.Select;
        return (): void => {
            setState({
                type, params: { itemName, sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    const setProperties = (sectionName: string, itemName: string): (properties: P) => void => {
        const type = Action.SetProperties;
        return (properties: P): void => {
            setState({
                type, params: { properties, itemName, sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    const setItemName = (sectionName: string, itemName: string): (newName: string) => void => {
        const type = Action.SetItemName;
        return (newName: string): void => {
            setState({
                type, params: { newName, itemName, sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    const setSelected = (sectionName: string, itemName: string): (selected: boolean) => void => {
        const type = Action.SetSelected;
        return (selected: boolean): void => {
            setState({
                type, params: { selected, itemName, sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    // section actions
    const setSectionName = (sectionName: string): (newName: string) => void => {
        const type = Action.SetSectionName;
        return (newName: string): void => {
            setState({
                type, params: { newName, sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    const setItems = (sectionName: string): (items: Item<P>[]) => void => {
        const type = Action.SetItems;
        return (items: Item<P>[]): void => {
            setState({
                type, params: { items, sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    const selectAll = (sectionName: string): () => void => {
        const type = Action.SelectAll;
        return (): void => {
            setState({
                type, params: { sectionName }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    // utility actions
    const setSections = (): (sections: Section<P>[]) => void => {
        const type = Action.SetSections;
        return (sections: Section<P>[]): void => {
            setState({
                type, params: { sections }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    const createNewUtility = (): (items: SelectUtilityBase<P>[]) => void => {

        const type = Action.CreateNewUtility;
        return (items: SelectUtilityBase<P>[]): void => {
            setState({
                type, params: { items }
            } satisfies ActionStfy<typeof type, P>);
        };
    };

    // section functions
    const isIndeterminate = (sectionName: string): () => boolean => {
        return (): boolean => {
            const section = findSectionInState(sectionName);
            if (section) {
                if (section.isAllSelected())
                    return false;

                return section.items.some(item => item.selected);
            }
            return false;
        };
    };

    const isAllSelected = (sectionName: string): () => boolean => {
        return (): boolean => {
            const section = findSectionInState(sectionName);

            if (section) {
                section.items.forEach(item => {
                    console.log(item.selected);
                });
                console.log(state);
                return !section.items.filter(item => !item.selected).length;
            }
            return false;
        };
    };

    const isAnySelected = (sectionName: string): () => boolean => {
        return (): boolean => {
            const section = findSectionInState(sectionName);
            if (section) {
                return section.isIndeterminate() || section.isAllSelected();
            }
            return false;
        };
    };

    const getSelectedItems = (sectionName: string): () => Item<P>[] => {
        return (): Item<P>[] => {
            const section = findSectionInState(sectionName);
            if (section) {
                return section.items.filter(item => item.selected);
            }
            return [];
        };

    };

    // utility functions
    const isAnyItemChecked = (): () => boolean => {
        return (): boolean => {
            return !!globalSelectUtility?.sections.find(section => section.isAnySelected());
        };
    };

    const getSelectedSections = (): () => Section<P>[] => {
        return (): Section<P>[] => {
            return globalSelectUtility?.sections.filter(section => section.isAnySelected()) ?? [];
        };
    };

    // reducer
    const selectUtilityReducer = (draft: WritableDraft<SelectUtility<P>>, action: ActionType<Action, P>): void => {
        const getItem = (sectionName: string, itemName: string): WritableDraft<Item<P>> | undefined => {
            return getSection(sectionName)?.items.find(item => item.itemName === itemName);
        };

        const getSection = (sectionName: string): WritableDraft<Section<P>> | undefined => {
            return draft.sections.find(section => section.sectionName === sectionName);
        };

        switch (action.type) {
            case Action.Select: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.sectionName, actionT.params.itemName);
                if (item)
                    item.selected = !item.selected;
                break;
            }

            case Action.SetProperties: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.sectionName, actionT.params.itemName);
                if (item)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    item.properties = castDraft(actionT.params.properties);
                break;
            }

            case Action.SetItemName: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.sectionName, actionT.params.itemName);
                if (item)
                    item.itemName = actionT.params.newName;
                break;
            }

            case Action.SetSelected: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.sectionName, actionT.params.itemName);
                if (item)
                    item.selected = actionT.params.selected;
                break;
            }

            case Action.SetSectionName: {
                const actionT = action as ActionType<typeof action.type, P>;
                const section = getSection(actionT.params.sectionName);
                if (section)
                    section.sectionName = actionT.params.newName;
                break;
            }

            case Action.SetItems: {
                const actionT = action as ActionType<typeof action.type, P>;
                const section = getSection(actionT.params.sectionName);
                if (section)
                    section.items = castDraft(actionT.params.items);
                break;
            }

            case Action.SelectAll: {
                const actionT = action as ActionType<typeof action.type, P>;
                const section = getSection(actionT.params.sectionName);
                if (section) {
                    const isIndeterminate = section.isIndeterminate();
                    section.items.forEach((item) => {
                        if (isIndeterminate)
                            item.setSelected(true);
                        else
                            item.select();
                    });
                }
                break;
            }

            case Action.SetSections: {
                const actionT = action as ActionType<typeof action.type, P>;
                draft.sections = castDraft(actionT.params.sections);
                break;
            }

            case Action.CreateNewUtility: {
                const actionT = action as ActionType<typeof action.type, P>;


                const newUtility = intializeUtility(actionT.params.items);
                draft.sections = castDraft(newUtility.sections);
                break;
            }

            default:
                break;
        }
    };

    const intializeUtility = (items: SelectUtilityBase<P>[]): SelectUtility<P> => {
        const sections: Section<P>[] = [];
        items.forEach((newItem) => {
            newItem.sectionName ??= 'unnamed_section';

            const createSection = (): Section<P> => {
                newItem.sectionName ??= 'unnamed_section';

                return {
                    sectionName: newItem.sectionName,
                    items: [createItem()],
                    setItems: setItems(newItem.sectionName),
                    setSectionName: setSectionName(newItem.sectionName),
                    selectAll: selectAll(newItem.sectionName),
                    getSelectedItems: getSelectedItems(newItem.sectionName),
                    isAnySelected: isAnySelected(newItem.sectionName),
                    isAllSelected: isAllSelected(newItem.sectionName),
                    isIndeterminate: isIndeterminate(newItem.sectionName),
                };
            };

            const createItem = (): Item<P> => {
                newItem.selected ??= false;
                newItem.properties ??= {} as P;
                newItem.sectionName ??= 'unnamed_section';

                return {
                    itemName: newItem.itemName,
                    selected: newItem.selected,
                    properties: newItem.properties,
                    select: select(newItem.sectionName, newItem.itemName),
                    setItemName: setItemName(newItem.sectionName, newItem.itemName),
                    setProperties: setProperties(newItem.sectionName, newItem.itemName),
                    setSelected: setSelected(newItem.sectionName, newItem.itemName)
                };
            };

            const sectionInNewState = sections.find(section => section.sectionName === newItem.sectionName);
            const itemInOldState = globalSelectUtility?.sections.find(section => section.sectionName === newItem.sectionName)?.items.find(item => item.itemName === newItem.itemName);


            // add new section and new item
            if (!sectionInNewState) {
                sections.push(createSection());
                return;
            }

            // add exsisting item to exsisting section
            if (itemInOldState) {
                sectionInNewState.items.push(itemInOldState);
                return;
            }

            // add new item to exsisting state
            if (!itemInOldState) {
                sectionInNewState.items.push(createItem());
                return;
            }

        });

        const selectUtility: SelectUtility<P> = {
            sections,
            setSections: setSections(),
            isAnyItemChecked: isAnyItemChecked(),
            getSelectedSections: getSelectedSections(),
            createNewUtility: createNewUtility()
        };

        return selectUtility;
    };

    // state
    const [state, setState] = useImmerReducer<SelectUtility<P>, ActionType<Action, P>>((draft, action) => { selectUtilityReducer(draft, action); }, intializeUtility(items));

    globalSelectUtility = state;
    return [state];
};