/* eslint-disable func-style */
// react-checkbox-hook
// react-checkbox

import { ActionStfy, ActionType, SelectUtility, SelectUtilityBase } from '@custom/types';
import { Draft, WritableDraft } from 'immer/dist/internal';
import { castDraft, immerable } from 'immer';
import { useImmerReducer } from 'use-immer';

export enum Action {
    Select = 0,
    SetProperties = 1,
    SetItemName = 2,
    SetSelected = 3,
    SetSectionName = 4,
    SetItems = 5,
    SelectAll = 6,
    SetSections = 7,
    CreateNewUtility = 8
}

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = <P = Record<string, never>>(items: SelectUtilityBase<P>[]): [SelectUtility<P>] => {

    class SelectUtility<J extends P> {
        [immerable] = true;
        public readonly sections: Section<J>[];

        constructor(sections: Section<J>[]) {
            this.sections = sections;
        }

        public setSections(sections: Section<P>[]): void {
            const type = Action.SetSections;
            setState({
                type, params: { sections }
            } satisfies ActionStfy<typeof type, P>);
        }

        public createNewUtility(items: SelectUtilityBase<P>[]): void {
            const type = Action.CreateNewUtility;
            setState({
                type, params: { items }
            } satisfies ActionStfy<typeof type, P>);
        }

        public isAnyItemChecked(): boolean {
            return !!this.sections.find(section => section.isAnySelected());
        }

        public getSelectedSections(): Section<P>[] {
            return this.sections.filter(section => section.isAnySelected()) ?? [];
        }
    }

    class Section<J extends P> {
        [immerable] = true;
        public readonly name: string;
        public readonly items: Item<J>[];

        constructor(name: string, items: Item<J>[]) {
            this.name = name;
            this.items = items;
        }

        public setSectionName(name: string): void {
            const type = Action.SetSectionName;
            setState({
                type, params: { name, section: this }
            } satisfies ActionStfy<typeof type, P>);
        }

        public setItems(items: Item<P>[]): void {
            const type = Action.SetItems;
            setState({
                type, params: { items, section: this }
            } satisfies ActionStfy<typeof type, P>);
        }

        public selectAll(): void {
            const type = Action.SelectAll;
            setState({
                type, params: { section: this }
            });
        }

        public isIndeterminate(): boolean {
            if (this.isAllSelected())
                return false;

            return this.items.some(item => item.isSelected);
        }

        public isAllSelected(): boolean {
            return !this.items.filter(item => !item.isSelected).length;
        }

        public isAnySelected(): boolean {
            return this.isIndeterminate() || this.isAllSelected();
        }

        public getSelectedItems(): Item<P>[] {
            return this.items.filter(item => item.isSelected);
        }
    }

    class Item<J extends P> {
        [immerable] = true;
        public readonly name: string;
        public readonly isSelected: boolean;
        public readonly sectionName: string;
        public readonly properties: J;

        constructor(name: string, sectionName: string, isSelected: boolean, properties: J) {
            this.name = name;
            this.sectionName = sectionName;
            this.isSelected = isSelected;
            this.properties = properties;
        }

        public select(): void {
            const type = Action.Select;
            setState({
                type, params: { item: this }
            } satisfies ActionStfy<typeof type, P>);
        }

        public setProperties(properties: P): void {
            const type = Action.SetProperties;
            setState({
                type, params: { properties, item: this }
            } satisfies ActionStfy<typeof type, P>);
        }

        public setItemName(name: string): void {
            const type = Action.SetItemName;
            setState({
                type, params: { name, item: this }
            } satisfies ActionStfy<typeof type, P>);
        }

        public setSelected(isSelected: boolean): void {
            const type = Action.SetSelected;
            setState({
                type, params: { isSelected, item: this }
            }  satisfies ActionStfy<typeof type, P>);
        }
    }

    // reducer
    const selectUtilityReducer = (draft: WritableDraft<SelectUtility<P>>, action: ActionType<Action, P>): void => {
        const getItem = (sectionName: string, itemName: string): WritableDraft<Item<P>> | undefined => {
            return getSection(sectionName)?.items.find(item => item.name === itemName);
        };

        const getSection = (sectionName: string): WritableDraft<Section<P>> | undefined => {
            return draft.sections.find(section => section.name === sectionName);
        };

        switch (action.type) {
            case Action.Select: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.item.sectionName, actionT.params.item.name);

                if (item) {
                    item.isSelected = !item.isSelected;
                }

                break;
            }

            case Action.SetProperties: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.item.sectionName, actionT.params.item.name);
                if (item)
                    item.properties = castDraft(actionT.params.properties) as P extends object ? Draft<P> : P;
                break;
            }

            case Action.SetItemName: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.item.sectionName, actionT.params.item.name);
                if (item)
                    item.name = actionT.params.name;
                break;
            }

            case Action.SetSelected: {
                const actionT = action as ActionType<typeof action.type, P>;
                const item = getItem(actionT.params.item.sectionName, actionT.params.item.name);
                if (item)
                    item.isSelected = actionT.params.isSelected;
                break;
            }

            case Action.SetSectionName: {
                const actionT = action as ActionType<typeof action.type, P>;
                const section = getSection(actionT.params.section.name);
                if (section)
                    section.name = actionT.params.name;
                break;
            }

            case Action.SetItems: {
                const actionT = action as ActionType<typeof action.type, P>;
                const section = getSection(actionT.params.section.name);
                if (section)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    section.items = castDraft(actionT.params.items);
                break;
            }

            case Action.SelectAll: {
                const actionT = action as ActionType<typeof action.type, P>;
                const section = getSection(actionT.params.section.name);
                if (section) {
                    const isIndeterminate = section.isIndeterminate();
                    section.items.forEach((item) => {
                        if (isIndeterminate)
                            item.isSelected = true;
                        else
                            item.isSelected = !item.isSelected;
                    });
                }
                break;
            }

            case Action.SetSections: {
                const actionT = action as ActionType<typeof action.type, P>;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
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

            // default values
            newItem.isSelected ??= false;
            newItem.properties ??= {} as P;
            newItem.sectionName ??= 'unnamed_section';

            const sectionInNewState = sections.find(section => section.name === newItem.sectionName);
            let itemInOldState: Item<P> | undefined = undefined;
            try {
                itemInOldState = state.sections.find(section => section.name === newItem.sectionName)?.items.find(item => item.name === newItem.itemName);
            } catch (e) { /* empty */ }

            // add new section and new item
            if (!sectionInNewState) {
                sections.push(new Section<P>(newItem.sectionName, [new Item<P>(newItem.itemName, newItem.sectionName, newItem.isSelected, newItem.properties)])
                );
                return;
            }

            // add exsisting item to exsisting section
            if (itemInOldState) {
                sectionInNewState.items.push(itemInOldState);
                return;
            }

            // add new item to exsisting state
            if (!itemInOldState) {
                sectionInNewState.items.push(new Item<P>(newItem.itemName, newItem.sectionName, newItem.isSelected, newItem.properties));
                return;
            }

        });

        return new SelectUtility(sections);
    };

    // state
    const [state, setState] = useImmerReducer<SelectUtility<P>, ActionType<Action, P>>((draft, action) => { selectUtilityReducer(draft, action); }, intializeUtility(items));

    return [state];
};