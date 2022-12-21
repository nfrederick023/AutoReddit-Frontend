
import { Dispatch, SetStateAction, useState } from 'react';

/**
 * A hook for checkboxes with select all. 
 * @param initialState the intial check state of the checkboxes
 * @returns a utility class containing the necassary functions needed for useCheckbox 
 */
export const useCheckbox = (initialState: Map<string, Map<string, boolean>>): [CheckBoxUtility] => {
  const [state, setState] = useState<Map<string, Map<string, boolean>>>(initialState);

  return [new CheckBoxUtility(state, setState)];
};

/**
 *  Class which contains the necassary functions needed for useCheckbox 
 */
class CheckBoxUtility {
  public checkedState: Map<string, Map<string, boolean>>;
  public setState: Dispatch<SetStateAction<Map<string, Map<string, boolean>>>>;

  public constructor(checkedState: Map<string, Map<string, boolean>>, setState: Dispatch<SetStateAction<Map<string, Map<string, boolean>>>>) {
    this.checkedState = checkedState;
    this.setState = setState;
  }

  public addCheckboxes = (boxesToAdd: string[][]): void => {
    const newCheckedState: Map<string, Map<string, boolean>> = new Map();
    boxesToAdd.forEach(box => {
      console.log('here');
      if (this.checkedState.get(box[0])?.has(box[1])) {
        console.log('bjfdbsaj');
        const res = !!this.checkedState.get(box[0])?.get(box[1]);
        console.log('bjfdbsaj');
        console.log('bjfdbsaj');
      }
      const exsistingState = this.checkedState.get(box[0])?.has(box[1]) ? !!this.checkedState.get(box[0])?.get(box[1]) : false;
      const childMap = newCheckedState.get(box[0]);
      if (childMap) {
        newCheckedState.set(box[0], childMap.set(box[1], exsistingState));
      } else {
        newCheckedState.set(box[0], new Map([[box[1], exsistingState]]));
      }
    });
    this.setState(newCheckedState);
  };

  /**
   * Checks or unchecks all the boxes of a given parent checkbox based on it's current check state. 
   * 
   * @param parent is the parent checkbox
   */
  public checkAllWithinParent = (parent: string): void => {
    const childCheckState = this.checkedState.get(parent) || new Map([]);
    if (this.isIndeterminate(parent))
      this.checkedState.get(parent)?.forEach((value, key) => { this.checkedState.set(parent, this.checkedState.get(parent)?.set(key, true) || new Map()); });
    else
      childCheckState.forEach((value, key) => { this.checkedState.set(parent, childCheckState.set(key, !value)); });
    this.setState(new Map(this.checkedState));
  };

  /**
   * Checks or unchecks all the boxes based on their current check state. 
   * 
   * @param parent is the parent checkbox
   */
  public checkAll = (): void => {
    this.checkedState.forEach((i, j) => this.checkAllWithinParent(j));
  };

  /**
   * Checks a single given child checkbox.
   * 
   * @param parent is the parent checkbox
   * @param child  is the child checkbox 
   */
  public checkOne = (parent: string, child: string): void => {
    const childCheckState = this.checkedState.get(parent) || new Map([[child, false]]);
    const updatedState = new Map(this.checkedState.set(parent, childCheckState.set(child, !childCheckState.get(child))));
    this.setState(updatedState);
  };

  /**
   * Determines if a given child checkbox is checked.
   * 
   * @param parent is the parent checkbox
   * @param child  is the child checkbox
   * @returns the check state of the child checkbox
   */
  public isChecked = (parent: string, child: string): boolean => {
    if (!this.checkedState.get(parent)) {
      const updatedState = new Map(this.checkedState.set(parent, new Map([[child, false]])));
      this.setState(updatedState);
    }

    return !!this.checkedState.get(parent)?.get(child);
  };

  /**
   * Determines if the parent checkbox state is indeterminate.
   * 
   * @param parent is the parent checkbox
   * @returns true if the parent checkbox state is indeterminate
   */
  public isIndeterminate = (parent: string): boolean => {
    if (this.isAllChecked(parent))
      return false;

    return !![...this.checkedState?.get(parent) || []].some(checked => checked[1]);
  };

  /**
   * Determines if all of the childern checkboxs within a given parent checkbox are checked.
   * 
   * @param parent is the parent checkbox
   * @returns true if the childern check boxes within the parent checkbox are all checked
   */
  public isAllChecked = (parent: string): boolean => {
    return ![...this.checkedState?.get(parent) || []].filter(([, v]) => !v).length;
  };

  /**
   * Determines if any of the childern checkboxs within a given parent checkbox are checked.
   * 
   * @param parent is the parent checkbox
   * @returns true if any of the childern check boxes within the parent checkbox are checked
   */
  public isAnyChildChecked = (parent: string): boolean => {
    return this.isIndeterminate(parent) || this.isAllChecked(parent);
  };

  /**
   * Determines if any checkbox is checked
   * 
   * @returns true if any check box is checked
   */
  public isAnyChecked = (): boolean => {
    return !![...this.checkedState].find(([k]) => this.isAnyChildChecked(k));
  };


  /**
   * Returns a map of all the checked boxes
   * 
   * @returns the map of all checked boxes
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

