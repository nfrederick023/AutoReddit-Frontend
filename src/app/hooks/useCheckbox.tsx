import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = <T,>(initialItems: SelectItemsBase<T>[]): [SelectUtility<T>] => {
  const selectUtility = new SelectUtility(initialItems.map(item => new SelectItems(item)));
  const [state, setState] = useState<SelectUtility<T>>(selectUtility);
  selectUtility.setHandler(setState);
  return [state];
};

export interface SelectItemsBase<T> {
  name?: string,
  section?: string,
  isSelected?: boolean,
  properties: T
}

export class SelectItems<T> {
  public readonly itemName: string;
  public readonly sectionName: string;
  public readonly isSelected: boolean;
  public readonly properties: T;

  constructor(selectItemsBase: SelectItemsBase<T>) {
    this.itemName = selectItemsBase.name || 'undefined';
    this.sectionName = selectItemsBase.section || 'undefined';
    this.isSelected = selectItemsBase.isSelected || false;
    this.properties = selectItemsBase.properties;
  }
}

export class Item<T>{
  private name: string;
  private isSelected: boolean;
  private properties: T;
  private updateState: () => void;

  public constructor(item: SelectItems<T>, updateState: () => void) {
    this.properties = item.properties;
    this.isSelected = item.isSelected;
    this.name = item.itemName;
    this.updateState = updateState;
  }

  // Functions
  public selectItem = (): void => {
    this.setIsSelected(!this.getIsSelected());
    this.updateState();
  };

  // Setters
  public setIsSelected = (isSelected: boolean): void => {
    this.isSelected = isSelected;
    this.updateState();
  };

  public setName = (name: string): void => {
    this.name = name;
    this.updateState();
  };

  public setProperties = (properties: T): void => {
    this.properties = properties;
    this.updateState();
  };

  // Getters
  public getIsSelected = (): boolean => {
    return this.isSelected;
  };

  public getName = (): string => {
    return this.name;
  };

  public getProperties = (): T => {
    return this.properties;
  };
}

export class Section<T> {
  private name: string;
  private items: Item<T>[];
  private updateState: () => void;

  public constructor(items: SelectItems<T>[], updateState: () => void) {
    this.name = items[0].sectionName;
    this.items = items.map((item): Item<T> => { return new Item(item, updateState); });
    this.updateState = updateState;
  }

  // Functions
  public isIndeterminate = (): boolean => {
    if (this.isAllSelected())
      return false;

    return this.items.some(item => item.getIsSelected());
  };

  public isAllSelected = (): boolean => {
    return !this.items.filter(item => !item.getIsSelected()).length;
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
    return this.items.filter(item => item.getIsSelected());
  };

  // Setters
  public setName = (name: string): void => {
    this.name = name;
    this.updateState();
  };

  public setItems = (items: Item<T>[]): void => {
    this.items = items;
    this.updateState();
  };

  // Getters
  public getName = (): string => {
    return this.name;
  };

  public getItems = (): Item<T>[] => {
    return this.items;
  };
}

class SelectUtility<T> {
  private setState: Dispatch<SelectUtility<T>> | undefined;
  private sections: Section<T>[];

  public constructor(items: SelectItems<T>[]) {
    this.sections = this.intializeSections(items);
  }

  private updateState = (): void => {
    if (this.setState)
      this.setState({ ...this });
  };

  private intializeSections = (newItems: SelectItems<T>[]): Section<T>[] => {

    const newSections: Section<T>[] = [];
    newItems.forEach((newItem) => {
      const sectionInNewState = newSections.find(section => section.getName() === newItem.sectionName);
      const itemInOldState = this.sections.find(section => section.getName() === newItem.sectionName)?.getItems().find(item => item.getName() === newItem.itemName);

      // add new section and new item 
      if (!sectionInNewState) {
        newSections.push(new Section([newItem], this.updateState));
        return;
      }

      // add exsisting item to exsisting section
      if (itemInOldState) {
        sectionInNewState.getItems().push(itemInOldState);
        return;
      }

      // add new item to exsisting state
      if (!itemInOldState) {
        sectionInNewState.getItems().push(new Item(newItem, this.updateState));
        return;
      }
    });

    return newSections;
  };

  public setHandler = (setState: Dispatch<SetStateAction<SelectUtility<T>>>): void => {
    this.setState = setState;
  };

  public setUtility = (newItems: SelectItems<T>[]): void => {
    this.sections = this.intializeSections(newItems);
    this.updateState();
  };

  public isAnyItemChecked = (): boolean => {
    return !!this.sections.find(section => section.isAnySelected());
  };

  public setSections = (sections: Section<T>[]): void => {
    this.sections = sections;
  };

  public getSelectedSections = (): Section<T>[] => {
    return this.sections.filter(section => section.isAnySelected());
  };

  public getSections = (): Section<T>[] => {
    return this.sections;
  };
}

