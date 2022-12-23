import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = <T,>(initialItems: CheckboxItemBase<T>[]): [CheckBoxUtility<T>] => {

  const [state, setState] = useState<CheckboxItemBase<T>[]>(initialItems);
  const checkBoxUtility = new CheckBoxUtility(state, setState);

  return [checkBoxUtility];
};


export interface CheckboxItemBase<T> {
  name?: string,
  section?: string,
  isChecked?: boolean,
  properties?: T
}

export interface CheckboxItem<T> {
  name: string,
  section: string,
  isChecked: boolean,
  properties: T
}

/**
 *  Class which contains the necassary functions needed for useCheckbox 
 */
class CheckBoxUtility<T> {
  private setState: Dispatch<SetStateAction<CheckboxItemBase<T>[]>>;
  private items: CheckboxItem<T>[];

  public constructor(items: CheckboxItemBase<T>[], setState: Dispatch<SetStateAction<CheckboxItemBase<T>[]>>) {
    this.items = this.setDefaultValues(items);
    this.setState = setState;
  }

  private updateItemState = (): void => {
    this.setState([...this.items]);
  };

  public getItemsBySection = (section: string): CheckboxItem<T>[] => {
    return this.items.filter(item => item.section === section);
  };

  public handleChange = (fn: (...args: unknown[]) => unknown): void => { fn(); this.updateItemState(); };


  public getItemsBySectionAndName = (section: string, name: string): CheckboxItem<T> | undefined => {
    return this.items.find(item => item.name === name && item.section === section);
  };

  private setDefaultValues = (items: CheckboxItemBase<T>[]): CheckboxItem<T>[] => {
    items.forEach((item, index) => {
      if (typeof (item.isChecked) === 'undefined')
        items[index].isChecked = false;
      if (!item.section)
        items[index].section = `${index}_checkbox_section`;
      if (!item.name)
        items[index].section = `${index}_checkbox`;
    });

    return items as CheckboxItem<T>[];
  };

  public updateItems = (newItems: CheckboxItemBase<T>[] | undefined): void => {
    const updatedItems = this.setDefaultValues(newItems || []);
    updatedItems.forEach((item, index) => {
      const exsistingItem = this.items.find(newItem => item.name === newItem.name && item.section === newItem.section);
      if (exsistingItem)
        updatedItems[index] = exsistingItem;
    });

    this.setState(updatedItems);
  };


  public getItems = (): CheckboxItem<T>[] => {
    return this.items;
  };

  public checkAllInSection = (section: string): void => {
    const isIndeterminate = this.isSectionIndeterminate(section);
    this.getItemsBySection(section).forEach((item) => {
      if (isIndeterminate)
        item.isChecked = true;
      else
        item.isChecked = !item.isChecked;
    });
    this.updateItemState();
  };

  public checkAll = (): void => {
    this.items.forEach((item) => this.checkAllInSection(item.section));
    this.updateItemState();
  };

  public checkOne = (section: string, name: string): void => {
    const item = this.getItemsBySectionAndName(section, name);
    if (item) {
      item.isChecked = !item.isChecked;
      this.updateItemState();
    }
  };

  public isSectionIndeterminate = (section: string): boolean => {
    if (this.isAllInSectionChecked(section))
      return false;

    return this.getItemsBySection(section).some(item => item.isChecked);
  };

  public isAllInSectionChecked = (section: string): boolean => {
    return !this.getItemsBySection(section).filter(item => !item.isChecked).length;
  };

  public isAnyInSectionChecked = (section: string): boolean => {
    return this.isSectionIndeterminate(section) || this.isAllInSectionChecked(section);
  };

  public isAnyChecked = (): boolean => {
    return !!this.items.find((item) => item.isChecked);
  };

  public getChecked = (): CheckboxItem<T>[] => {
    return this.items.filter(item => item.isChecked);
  };

  public isChecked = (section: string, name: string): boolean => {
    return !!this.getItemsBySectionAndName(section, name)?.isChecked;
  };
}

