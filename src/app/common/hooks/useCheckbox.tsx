import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = <T extends CheckboxBase>(initialState: Map<string, Map<string, T>>): [CheckBoxUtility<T>] => {
  const [state, setState] = useState<Map<string, Map<string, T>>>(initialState);

  return [new CheckBoxUtility(state, setState)];
};

export class CheckboxBase {
  private checked: boolean;

  constructor(isChecked: boolean) {
    this.checked = isChecked;
  }

  public isChecked = (): boolean => {
    return this.checked;
  };

  public setChecked = (newCheckedState: boolean): void => {
    this.checked = newCheckedState;
  };

  public check = (): void => {
    this.checked = !this.checked;
  };
}
/**
 *  Class which contains the necassary functions needed for useCheckbox 
 */
class CheckBoxUtility<T extends CheckboxBase> {
  private setState: Dispatch<SetStateAction<Map<string, Map<string, T>>>>;
  private checkedState: Map<string, Map<string, T>>;

  public constructor(state: Map<string, Map<string, T>>, setState: Dispatch<SetStateAction<Map<string, Map<string, T>>>>) {
    this.checkedState = state;
    this.setState = setState;
  }

  public updateCheckedState = (): void => {
    this.setState(new Map(this.checkedState));
  };

  public setCheckboxState = (newState: Map<string, Map<string, T>>): void => {
    this.checkedState.forEach((child, parentName) => {
      child.forEach((state, childName) => {
        if (newState.get(parentName)?.has(childName)) {
          newState.set(parentName, newState.get(parentName)?.set(childName, state) || new Map());
        }
      });
    });
    this.setState(newState);
  };

  public getCheckboxState = (): Map<string, Map<string, T>> => {
    return this.checkedState;
  };

  /**
   * Checks or unchecks all the boxes of a given parent checkbox based on it's current check state. 
   * 
   * @param parent is the parent checkbox
   */
  public checkAllWithinParent = (parent: string): void => {
    const parentIndeterminate = this.isParentIndeterminate(parent);
    this.checkedState.get(parent)?.forEach((childCheckbox) => {
      if (parentIndeterminate)
        childCheckbox.setChecked(true);
      else
        childCheckbox.check();
    });
    this.updateCheckedState();
  };

  /**
   * Checks or unchecks all the boxes based on their current check state. 
   * 
   * @param parent is the parent checkbox
   */
  public checkAll = (): void => {
    this.checkedState.forEach((i, j) => this.checkAllWithinParent(j));
    this.updateCheckedState();
  };

  /**
   * Checks a single given child checkbox.
   * 
   * @param parent is the parent checkbox
   * @param child  is the child checkbox 
   */
  public checkOne = (parent: string, child: string): void => {
    this.checkedState?.get(parent)?.get(child)?.check();
    this.updateCheckedState();
  };

  /**
   * Determines if a given child checkbox is checked.
   * 
   * @param parent is the parent checkbox
   * @param child  is the child checkbox
   * @returns the check state of the child checkbox
   */
  public isChecked = (parent: string, child: string): boolean => {
    return !!this.checkedState.get(parent)?.get(child)?.isChecked();
  };

  /**
   * Determines if the parent checkbox state is indeterminate.
   * 
   * @param parent is the parent checkbox
   * @returns true if the parent checkbox state is indeterminate
   */
  public isParentIndeterminate = (parent: string): boolean => {
    if (this.isAllChecked(parent))
      return false;

    return !![...this.checkedState?.get(parent) || []].some(checked => checked[1].isChecked());
  };

  /**
   * Determines if all of the childern checkboxs within a given parent checkbox are checked.
   * 
   * @param parent is the parent checkbox
   * @returns true if the childern check boxes within the parent checkbox are all checked
   */
  public isAllChecked = (parent: string): boolean => {
    return ![...this.checkedState?.get(parent) || []].filter(([, v]) => !v.isChecked()).length;
  };

  /**
   * Determines if any of the childern checkboxs within a given parent checkbox are checked.
   * 
   * @param parent is the parent checkbox
   * @returns true if any of the childern check boxes within the parent checkbox are checked
   */
  public isAnyChildChecked = (parent: string): boolean => {
    return this.isParentIndeterminate(parent) || this.isAllChecked(parent);
  };

  /**
   * Determines if any checkbox is checked
   * 
   * @returns true if any check box is checked
   */
  public isAnyChecked = (): boolean => {
    return !![...this.checkedState].find(([k]) => this.isAnyChildChecked(k));
  };

  public getChildState = (parent: string, child: string): T | undefined => {
    return this.checkedState.get(parent)?.get(child);
  };

  public updateState = (action: (...args: unknown[]) => unknown): void => {
    action();
    this.updateCheckedState();
  };

  /**
   * Returns a matrix of all the checked boxes
   * 
   * @returns the matrix of all checked boxes
   */
  public getAllChecked = (): string[][] => {
    const checkedBoxes: string[][] = [];
    this.checkedState.forEach((v, k) => {
      v.forEach((i, j) => {
        if (this.isChecked(k, j)) {
          checkedBoxes.push([k, j]);
        }
      });
    });
    return checkedBoxes;
  };
}

